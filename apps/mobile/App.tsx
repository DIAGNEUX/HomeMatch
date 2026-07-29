import React from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { TextInputProps } from "react-native";
import {
  Alert,
  Platform,
  StyleSheet,
} from "react-native";
import {
  ActivityIndicator,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Modal,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  View,
} from "./src/native-components";

import {
  agencyApi,
  announcementApi,
  assistantApi,
  authApi,
  favoriteApi,
  getImageUrl,
  visitApi,
} from "./src/api";
import type {
  Agency,
  Annonce,
  ConversationResponse,
  Favorite,
  Recommendation,
  RecommendationPayload,
  User,
  VisitRequest,
} from "./src/types";

type Screen =
  | "home"
  | "search"
  | "assistant"
  | "favorites"
  | "visits"
  | "profile"
  | "agencyDashboard"
  | "agencyVisits"
  | "agencyListings"
  | "agencyProfile";
type AuthMode = "login" | "register";

type AuthState = {
  token: string | null;
  user: User | null;
};

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  recommendations?: Recommendation[];
};

type AgencyForm = {
  name: string;
  description: string;
  siret: string;
  phone: string;
  website: string;
  address: string;
  city: string;
  postalCode: string;
  logo: string;
};

const colors = {
  background: "#F6F8FB",
  surface: "#FFFFFF",
  primary: "#0B162C",
  secondary: "#3B556D",
  muted: "#6B7481",
  border: "#E5E9ED",
  accent: "#5FC2BA",
  accentSoft: "#E8F8F6",
  danger: "#D12B35",
  dangerSoft: "#FDECEC",
  success: "#057A55",
  successSoft: "#E7F8EF",
};

function formatPrice(price: number) {
  return new Intl.NumberFormat("fr-FR", {
    maximumFractionDigits: 0,
  }).format(price);
}

function formatListingType(type: Annonce["typeAnnonce"]) {
  return type === "VENTE" ? "Vente" : "Location";
}

function formatPropertyType(type: Annonce["typeBien"]) {
  const labels: Record<Annonce["typeBien"], string> = {
    APPARTEMENT: "Appartement",
    MAISON: "Maison",
    STUDIO: "Studio",
    TERRAIN: "Terrain",
    LOCAL_COMMERCIAL: "Local",
    AUTRE: "Bien",
  };

  return labels[type];
}

function getFirstImage(annonce: Annonce) {
  return getImageUrl(annonce.images?.[0]?.url);
}

function normalizeRecommendations(
  recommendations: RecommendationPayload[] = [],
): Recommendation[] {
  return recommendations.map((recommendation) => {
    if ("annonce" in recommendation) {
      return recommendation;
    }

    return {
      annonce: recommendation as Annonce,
      highlights: [],
      differences: [],
    };
  });
}

function getDefaultVisitDate() {
  const date = new Date();
  date.setDate(date.getDate() + 3);
  date.setHours(14, 0, 0, 0);
  return date.toISOString().slice(0, 16);
}

function parseVisitDate(value: string) {
  const normalized = value.includes("T") ? value : value.replace(" ", "T");
  const date = new Date(normalized);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date.toISOString();
}

function Header({
  user,
  onAuth,
  onLogout,
}: {
  user: User | null;
  onAuth: (mode: AuthMode) => void;
  onLogout: () => void;
}) {
  const subtitle =
    user?.role === "AGENCY" ? "Espace agence" : "Votre futur logement";

  return (
    <View style={styles.header}>
      <View>
        <Text style={styles.brand}>HomeMatch</Text>
        <Text style={styles.brandSubtitle}>{subtitle}</Text>
      </View>
      {user ? (
        <Pressable style={styles.ghostButton} onPress={onLogout}>
          <Text style={styles.ghostButtonText}>Déconnexion</Text>
        </Pressable>
      ) : (
        <Pressable style={styles.primaryButtonSmall} onPress={() => onAuth("login")}>
          <Text style={styles.primaryButtonSmallText}>Connexion</Text>
        </Pressable>
      )}
    </View>
  );
}

function BottomTabs({
  active,
  user,
  onChange,
}: {
  active: Screen;
  user: User | null;
  onChange: (screen: Screen) => void;
}) {
  const tabs: { label: string; value: Screen; protected?: boolean }[] =
    user?.role === "AGENCY"
      ? [
          { label: "Tableau", value: "agencyDashboard", protected: true },
          { label: "Demandes", value: "agencyVisits", protected: true },
          { label: "Annonces", value: "agencyListings", protected: true },
          { label: "Profil", value: "agencyProfile", protected: true },
        ]
      : [
          { label: "Accueil", value: "home" },
          { label: "Recherche", value: "search" },
          { label: "IA", value: "assistant" },
          { label: "Favoris", value: "favorites", protected: true },
          { label: "Profil", value: "profile", protected: true },
        ];

  return (
    <View style={styles.tabs}>
      {tabs.map((tab) => {
        const isActive = active === tab.value;
        return (
          <Pressable
            key={tab.value}
            style={[styles.tabItem, isActive && styles.tabItemActive]}
            onPress={() => {
              if (tab.protected && !user) {
                Alert.alert("Connexion requise", "Connectez-vous pour accéder à cet espace.");
                return;
              }
              onChange(tab.value);
            }}
          >
            <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

function EmptyState({ title, text }: { title: string; text: string }) {
  return (
    <View style={styles.emptyState}>
      <Text style={styles.emptyTitle}>{title}</Text>
      <Text style={styles.emptyText}>{text}</Text>
    </View>
  );
}

function AuthModal({
  visible,
  mode,
  onClose,
  onSwitchMode,
  onAuthenticated,
}: {
  visible: boolean;
  mode: AuthMode;
  onClose: () => void;
  onSwitchMode: (mode: AuthMode) => void;
  onAuthenticated: (state: AuthState) => void;
}) {
  const isRegister = mode === "register";
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    setError(null);
    setLoading(true);

    try {
      const response = isRegister
        ? await authApi.register({
            firstName,
            lastName,
            phone,
            email,
            password,
          })
        : await authApi.login(email, password);

      if (response.user.role === "ADMIN") {
        setError("L'espace admin n'est pas disponible dans l'application mobile.");
        return;
      }

      onAuthenticated({
        token: response.access_token,
        user: response.user,
      });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentification impossible.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal animationType="slide" visible={visible} onRequestClose={onClose}>
      <SafeAreaView style={styles.modalPage}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={styles.modalContent}
        >
          <ScrollView keyboardShouldPersistTaps="handled">
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.screenTitle}>
                  {isRegister ? "Créer un compte" : "Se connecter"}
                </Text>
                <Text style={styles.screenSubtitle}>
                  Accédez à vos visites et favoris HomeMatch.
                </Text>
              </View>
              <Pressable onPress={onClose}>
                <Text style={styles.closeText}>Fermer</Text>
              </Pressable>
            </View>

            {isRegister && (
              <>
                <AppInput label="Prénom" value={firstName} onChangeText={setFirstName} />
                <AppInput label="Nom" value={lastName} onChangeText={setLastName} />
                <AppInput label="Téléphone" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
              </>
            )}

            <AppInput
              label="Email"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
            <AppInput
              label="Mot de passe"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

            {error && <Text style={styles.errorText}>{error}</Text>}

            <Pressable style={styles.primaryButton} onPress={submit} disabled={loading}>
              {loading ? (
                <ActivityIndicator color={colors.primary} />
              ) : (
                <Text style={styles.primaryButtonText}>
                  {isRegister ? "Créer mon compte" : "Me connecter"}
                </Text>
              )}
            </Pressable>

            <Pressable
              style={styles.linkButton}
              onPress={() => onSwitchMode(isRegister ? "login" : "register")}
            >
              <Text style={styles.linkText}>
                {isRegister
                  ? "J'ai déjà un compte"
                  : "Créer un compte particulier"}
              </Text>
            </Pressable>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
}

function AppInput({
  label,
  style,
  ...props
}: TextInputProps & { label: string }) {
  return (
    <View style={styles.inputGroup}>
      <Text style={styles.inputLabel}>{label}</Text>
      <TextInput
        {...props}
        placeholderTextColor="#9CA3AD"
        style={[styles.input, style]}
      />
    </View>
  );
}

function HomeScreen({
  onSearch,
  onAssistant,
}: {
  onSearch: (query: string) => void;
  onAssistant: (message: string) => void;
}) {
  const [message, setMessage] = useState("");

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.screenContent}>
      <View style={styles.heroCard}>
        <Text style={styles.heroTitle}>Votre futur logement vous attend.</Text>
        <Text style={styles.heroText}>
          Décrivez votre projet et laissez HomeMatch vous guider vers les biens les plus adaptés.
        </Text>
      </View>

      <View style={styles.searchBox}>
        <Text style={styles.sectionTitle}>Assistant HomeMatch</Text>
        <TextInput
          value={message}
          onChangeText={setMessage}
          placeholder="Exemple : appartement à Paris à louer pour 1700 euros"
          placeholderTextColor="#9CA3AD"
          multiline
          style={styles.textArea}
        />
        <View style={styles.rowGap}>
          <Pressable
            style={styles.primaryButton}
            onPress={() => {
              if (message.trim()) onAssistant(message.trim());
            }}
          >
            <Text style={styles.primaryButtonText}>Lancer avec l'IA</Text>
          </Pressable>
          <Pressable
            style={styles.secondaryButton}
            onPress={() => onSearch(message.trim())}
          >
            <Text style={styles.secondaryButtonText}>Recherche classique</Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}

function ListingCard({
  annonce,
  onPress,
}: {
  annonce: Annonce;
  onPress: () => void;
}) {
  const imageUrl = getFirstImage(annonce);

  return (
    <Pressable style={styles.listingCard} onPress={onPress}>
      {imageUrl ? (
        <Image source={{ uri: imageUrl }} style={styles.listingImage} />
      ) : (
        <View style={[styles.listingImage, styles.imagePlaceholder]}>
          <Text style={styles.imagePlaceholderText}>HomeMatch</Text>
        </View>
      )}
      <View style={styles.listingBody}>
        <View style={styles.badgeRow}>
          <Text style={styles.badge}>{formatListingType(annonce.typeAnnonce)}</Text>
          <Text style={styles.badgeMuted}>{formatPropertyType(annonce.typeBien)}</Text>
        </View>
        <Text style={styles.listingTitle} numberOfLines={2}>
          {annonce.titre}
        </Text>
        <Text style={styles.location}>{annonce.ville}</Text>
        <Text style={styles.price}>
          {formatPrice(annonce.prix)} {annonce.typeAnnonce === "LOCATION" ? "€/mois" : "€"}
        </Text>
        <Text style={styles.meta}>
          {annonce.surface} m² · {annonce.nombrePieces} pièces · {annonce.nombreChambres} ch.
        </Text>
      </View>
    </Pressable>
  );
}

function SearchScreen({
  onOpen,
}: {
  onOpen: (annonce: Annonce) => void;
}) {
  const [city, setCity] = useState("");
  const [query, setQuery] = useState("");
  const [annonces, setAnnonces] = useState<Annonce[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await announcementApi.search({
        ville: city.trim(),
        q: query.trim(),
      });
      setAnnonces(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Recherche impossible.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  return (
    <View style={styles.screen}>
      <View style={styles.screenContent}>
        <Text style={styles.screenTitle}>Rechercher</Text>
        <Text style={styles.screenSubtitle}>Parcourez les annonces publiées.</Text>
        <View style={styles.filters}>
          <TextInput
            value={city}
            onChangeText={setCity}
            placeholder="Ville"
            placeholderTextColor="#9CA3AD"
            style={styles.input}
          />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Mot-clé"
            placeholderTextColor="#9CA3AD"
            style={styles.input}
          />
          <Pressable style={styles.primaryButton} onPress={load}>
            <Text style={styles.primaryButtonText}>Rechercher</Text>
          </Pressable>
        </View>
        {error && <Text style={styles.errorText}>{error}</Text>}
      </View>

      {loading ? (
        <ActivityIndicator style={styles.loader} color={colors.primary} />
      ) : (
        <FlatList
          data={annonces}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <ListingCard annonce={item} onPress={() => onOpen(item)} />
          )}
          ListEmptyComponent={
            <EmptyState
              title="Aucune annonce"
              text="Essayez une autre ville ou un autre mot-clé."
            />
          }
        />
      )}
    </View>
  );
}

function AssistantScreen({
  initialMessage,
  onOpen,
}: {
  initialMessage?: string | null;
  onOpen: (annonce: Annonce) => void;
}) {
  const [conversationId, setConversationId] = useState<string | undefined>();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Bonjour, décrivez votre recherche. Je vous poserai les questions utiles puis je proposerai des biens.",
    },
  ]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!initialMessage) return;
    void send(initialMessage, true);
  }, [initialMessage]);

  const send = async (message = text.trim(), startNew = false) => {
    if (!message) return;

    setText("");
    setError(null);
    setLoading(true);

    const userMessage: ChatMessage = {
      id: `${Date.now()}-user`,
      role: "user",
      content: message,
    };

    setMessages((previous) =>
      startNew ? [userMessage] : [...previous, userMessage],
    );

    try {
      const response: ConversationResponse = await assistantApi.chat({
        message,
        conversationId: startNew ? undefined : conversationId,
      });
      setConversationId(response.conversationId);

      const recommendations = normalizeRecommendations(response.annonces);
      const content =
        response.nextQuestion ??
        response.message ??
        (recommendations.length > 0
          ? `J'ai trouvé ${recommendations.length} bien${recommendations.length > 1 ? "s" : ""}.`
          : "Je n'ai pas encore assez d'informations.");

      setMessages((previous) => [
        ...previous,
        {
          id: `${Date.now()}-assistant`,
          role: "assistant",
          content,
          recommendations,
        },
      ]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Assistant indisponible.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.screen}
    >
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.chatContent}
        renderItem={({ item }) => (
          <View>
            <View
              style={[
                styles.messageBubble,
                item.role === "user" ? styles.userBubble : styles.assistantBubble,
              ]}
            >
              <Text
                style={[
                  styles.messageText,
                  item.role === "user" && styles.userMessageText,
                ]}
              >
                {item.content}
              </Text>
            </View>
            {item.recommendations?.map((recommendation) => (
              <ListingCard
                key={recommendation.annonce.id}
                annonce={recommendation.annonce}
                onPress={() => onOpen(recommendation.annonce)}
              />
            ))}
          </View>
        )}
      />
      {error && <Text style={[styles.errorText, styles.chatError]}>{error}</Text>}
      <View style={styles.chatInputBar}>
        <TextInput
          value={text}
          onChangeText={setText}
          placeholder="Votre recherche..."
          placeholderTextColor="#9CA3AD"
          style={styles.chatInput}
        />
        <Pressable
          style={[styles.sendButton, loading && styles.disabledButton]}
          onPress={() => void send()}
          disabled={loading}
        >
          <Text style={styles.sendButtonText}>{loading ? "..." : "Envoyer"}</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

function DetailModal({
  annonce,
  token,
  userRole,
  onClose,
  onRequireAuth,
}: {
  annonce: Annonce | null;
  token: string | null;
  userRole: User["role"] | null;
  onClose: () => void;
  onRequireAuth: () => void;
}) {
  const [favorite, setFavorite] = useState(false);
  const [visitVisible, setVisitVisible] = useState(false);

  useEffect(() => {
    if (!annonce || !token || userRole !== "USER") {
      setFavorite(false);
      return;
    }

    favoriteApi
      .status(token, annonce.id)
      .then((response) => setFavorite(response.data.isFavorite))
      .catch(() => undefined);
  }, [annonce, token, userRole]);

  if (!annonce) return null;

  const imageUrl = getFirstImage(annonce);

  const toggleFavorite = async () => {
    if (!token) {
      onRequireAuth();
      return;
    }

    try {
      if (favorite) {
        await favoriteApi.remove(token, annonce.id);
        setFavorite(false);
      } else {
        await favoriteApi.add(token, annonce.id);
        setFavorite(true);
      }
    } catch (err) {
      Alert.alert("Favoris", err instanceof Error ? err.message : "Action impossible.");
    }
  };

  return (
    <Modal animationType="slide" visible={!!annonce} onRequestClose={onClose}>
      <SafeAreaView style={styles.modalPage}>
        <ScrollView>
          {imageUrl ? (
            <Image source={{ uri: imageUrl }} style={styles.detailImage} />
          ) : (
            <View style={[styles.detailImage, styles.imagePlaceholder]}>
              <Text style={styles.imagePlaceholderText}>HomeMatch</Text>
            </View>
          )}

          <View style={styles.detailBody}>
            <View style={styles.modalHeader}>
              <Text style={styles.badge}>{formatListingType(annonce.typeAnnonce)}</Text>
              <Pressable onPress={onClose}>
                <Text style={styles.closeText}>Fermer</Text>
              </Pressable>
            </View>

            <Text style={styles.detailTitle}>{annonce.titre}</Text>
            <Text style={styles.location}>
              {annonce.adresse}, {annonce.ville}
            </Text>
            <Text style={styles.detailPrice}>
              {formatPrice(annonce.prix)} {annonce.typeAnnonce === "LOCATION" ? "€/mois" : "€"}
            </Text>

            <View style={styles.statsGrid}>
              <Stat label="Type" value={formatPropertyType(annonce.typeBien)} />
              <Stat label="Surface" value={`${annonce.surface} m²`} />
              <Stat label="Pièces" value={String(annonce.nombrePieces)} />
              <Stat label="Chambres" value={String(annonce.nombreChambres)} />
            </View>

            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{annonce.description}</Text>

            {annonce.agency && (
              <View style={styles.agencyBox}>
                <Text style={styles.agencyLabel}>Agence</Text>
                <Text style={styles.agencyName}>{annonce.agency.name}</Text>
                {annonce.agency.city && (
                  <Text style={styles.location}>{annonce.agency.city}</Text>
                )}
              </View>
            )}

            {userRole !== "AGENCY" && (
              <>
                <Pressable style={styles.primaryButton} onPress={() => {
                  if (!token) onRequireAuth();
                  else setVisitVisible(true);
                }}>
                  <Text style={styles.primaryButtonText}>Demander une visite</Text>
                </Pressable>
                <Pressable style={styles.secondaryButton} onPress={toggleFavorite}>
                  <Text style={styles.secondaryButtonText}>
                    {favorite ? "Retirer des favoris" : "Ajouter aux favoris"}
                  </Text>
                </Pressable>
              </>
            )}
          </View>
        </ScrollView>

        <VisitModal
          visible={visitVisible}
          annonce={annonce}
          token={token}
          onClose={() => setVisitVisible(false)}
        />
      </SafeAreaView>
    </Modal>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
    </View>
  );
}

function VisitModal({
  visible,
  annonce,
  token,
  onClose,
}: {
  visible: boolean;
  annonce: Annonce;
  token: string | null;
  onClose: () => void;
}) {
  const [message, setMessage] = useState("Bonjour, je souhaite visiter ce bien.");
  const [date, setDate] = useState(getDefaultVisitDate());
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!token) return;

    const requestedVisitDate = parseVisitDate(date);

    if (!requestedVisitDate) {
      Alert.alert("Date invalide", "Utilisez le format AAAA-MM-JJTHH:mm.");
      return;
    }

    setLoading(true);
    try {
      await visitApi.create(token, annonce.id, {
        message,
        requestedVisitDate,
      });
      Alert.alert("Demande envoyée", "Votre demande de visite a bien été envoyée.");
      onClose();
    } catch (err) {
      Alert.alert("Erreur", err instanceof Error ? err.message : "Envoi impossible.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal animationType="slide" visible={visible} transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.visitCard}>
          <View style={styles.modalHeader}>
            <Text style={styles.sectionTitle}>Demande de visite</Text>
            <Pressable onPress={onClose}>
              <Text style={styles.closeText}>Fermer</Text>
            </Pressable>
          </View>
          <Text style={styles.location} numberOfLines={2}>{annonce.titre}</Text>
          <AppInput label="Date souhaitée" value={date} onChangeText={setDate} />
          <AppInput
            label="Message"
            value={message}
            onChangeText={setMessage}
            multiline
            style={styles.textAreaSmall}
          />
          <Pressable style={styles.primaryButton} onPress={submit} disabled={loading}>
            <Text style={styles.primaryButtonText}>
              {loading ? "Envoi..." : "Envoyer la demande"}
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

function FavoritesScreen({
  token,
  onOpen,
}: {
  token: string;
  onOpen: (annonce: Annonce) => void;
}) {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const response = await favoriteApi.mine(token);
      setFavorites(response.data);
    } catch (err) {
      Alert.alert("Favoris", err instanceof Error ? err.message : "Chargement impossible.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, [token]);

  return (
    <View style={styles.screen}>
      <View style={styles.screenContent}>
        <Text style={styles.screenTitle}>Mes favoris</Text>
        <Text style={styles.screenSubtitle}>Vos annonces sauvegardées.</Text>
      </View>
      {loading ? (
        <ActivityIndicator style={styles.loader} />
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <ListingCard annonce={item.annonce} onPress={() => onOpen(item.annonce)} />
          )}
          ListEmptyComponent={
            <EmptyState title="Aucun favori" text="Ajoutez des biens depuis leur fiche." />
          }
        />
      )}
    </View>
  );
}

function VisitsScreen({ token }: { token: string }) {
  const [visits, setVisits] = useState<VisitRequest[]>([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const response = await visitApi.mine(token);
      setVisits(response.data);
    } catch (err) {
      Alert.alert("Demandes", err instanceof Error ? err.message : "Chargement impossible.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, [token]);

  return (
    <View style={styles.screen}>
      <View style={styles.screenContent}>
        <Text style={styles.screenTitle}>Mes demandes</Text>
        <Text style={styles.screenSubtitle}>Suivez vos demandes de visite.</Text>
      </View>
      {loading ? (
        <ActivityIndicator style={styles.loader} />
      ) : (
        <FlatList
          data={visits}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <View style={styles.visitItem}>
              <Text style={styles.listingTitle}>{item.annonce?.titre ?? "Annonce"}</Text>
              <Text style={styles.location}>
                Visite souhaitée : {new Date(item.dateVisiteSouhaitee).toLocaleString("fr-FR")}
              </Text>
              <Text style={[styles.status, getStatusStyle(item.statut)]}>
                {formatStatus(item.statut)}
              </Text>
              <Text style={styles.description}>{item.message}</Text>
            </View>
          )}
          ListEmptyComponent={
            <EmptyState title="Aucune demande" text="Vos demandes apparaîtront ici." />
          }
        />
      )}
    </View>
  );
}

function formatStatus(status: VisitRequest["statut"]) {
  const labels: Record<VisitRequest["statut"], string> = {
    EN_ATTENTE: "En attente",
    ACCEPTEE: "Acceptée",
    REFUSEE: "Refusée",
    ANNULEE: "Annulée",
    TERMINEE: "Terminée",
  };

  return labels[status];
}

function getStatusStyle(status: VisitRequest["statut"]) {
  if (status === "ACCEPTEE") return styles.statusSuccess;
  if (status === "REFUSEE" || status === "ANNULEE") return styles.statusDanger;
  return styles.statusPending;
}

function ProfileScreen({
  user,
  onVisits,
}: {
  user: User;
  onVisits: () => void;
}) {
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.screenContent}>
      <Text style={styles.screenTitle}>Mon profil</Text>
      <View style={styles.profileCard}>
        <Text style={styles.profileInitials}>
          {user.firstName[0]}
          {user.lastName[0]}
        </Text>
        <Text style={styles.profileName}>
          {user.firstName} {user.lastName}
        </Text>
        <Text style={styles.location}>{user.email}</Text>
        {user.phone && <Text style={styles.location}>{user.phone}</Text>}
      </View>
      <Pressable style={styles.primaryButton} onPress={onVisits}>
        <Text style={styles.primaryButtonText}>Voir mes demandes de visite</Text>
      </Pressable>
    </ScrollView>
  );
}

function AgencyDashboardScreen({
  token,
  onVisits,
  onListings,
  onProfile,
}: {
  token: string;
  onVisits: () => void;
  onListings: () => void;
  onProfile: () => void;
}) {
  const [agency, setAgency] = useState<Agency | null>(null);
  const [visits, setVisits] = useState<VisitRequest[]>([]);
  const [listings, setListings] = useState<Annonce[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);

      try {
        const [agencyResponse, visitsResponse, listingsResponse] = await Promise.all([
          agencyApi.me(token),
          visitApi.received(token),
          announcementApi.mine(token),
        ]);

        setAgency(agencyResponse);
        setVisits(visitsResponse.data);
        setListings(listingsResponse.data);
      } catch (err) {
        Alert.alert("Agence", err instanceof Error ? err.message : "Chargement impossible.");
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, [token]);

  const pendingVisits = visits.filter((visit) => visit.statut === "EN_ATTENTE").length;
  const publishedListings = listings.filter((listing) => listing.statut === "PUBLIEE").length;

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.screenContent}>
      <Text style={styles.screenTitle}>Espace agence</Text>
      <Text style={styles.screenSubtitle}>
        {agency?.name ?? "Gérez vos demandes et vos annonces HomeMatch."}
      </Text>

      {loading ? (
        <ActivityIndicator style={styles.loader} />
      ) : (
        <>
          <View style={styles.metricGrid}>
            <View style={styles.metricCard}>
              <Text style={styles.metricValue}>{visits.length}</Text>
              <Text style={styles.metricLabel}>Demandes reçues</Text>
            </View>
            <View style={styles.metricCard}>
              <Text style={styles.metricValue}>{pendingVisits}</Text>
              <Text style={styles.metricLabel}>En attente</Text>
            </View>
            <View style={styles.metricCard}>
              <Text style={styles.metricValue}>{publishedListings}</Text>
              <Text style={styles.metricLabel}>Annonces publiées</Text>
            </View>
          </View>

          <View style={styles.rowGap}>
            <Pressable style={styles.primaryButton} onPress={onVisits}>
              <Text style={styles.primaryButtonText}>Voir les demandes</Text>
            </Pressable>
            <Pressable style={styles.secondaryButton} onPress={onListings}>
              <Text style={styles.secondaryButtonText}>Mes annonces</Text>
            </Pressable>
            <Pressable style={styles.secondaryButton} onPress={onProfile}>
              <Text style={styles.secondaryButtonText}>Modifier le profil agence</Text>
            </Pressable>
          </View>
        </>
      )}
    </ScrollView>
  );
}

function AgencyVisitsScreen({ token }: { token: string }) {
  const [visits, setVisits] = useState<VisitRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);

    try {
      const response = await visitApi.received(token);
      setVisits(response.data);
    } catch (err) {
      Alert.alert("Demandes", err instanceof Error ? err.message : "Chargement impossible.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, [token]);

  const updateStatus = async (id: string, status: "ACCEPTEE" | "REFUSEE") => {
    setUpdatingId(id);

    try {
      const response = await visitApi.updateStatus(token, id, status);
      setVisits((current) =>
        current.map((visit) => (visit.id === id ? response.data : visit)),
      );
    } catch (err) {
      Alert.alert("Statut", err instanceof Error ? err.message : "Mise à jour impossible.");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <View style={styles.screen}>
      <View style={styles.screenContent}>
        <Text style={styles.screenTitle}>Demandes reçues</Text>
        <Text style={styles.screenSubtitle}>
          Acceptez ou refusez les demandes de visite de vos annonces.
        </Text>
      </View>
      {loading ? (
        <ActivityIndicator style={styles.loader} />
      ) : (
        <FlatList
          data={visits}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => {
            const requesterName = item.utilisateur
              ? `${item.utilisateur.firstName} ${item.utilisateur.lastName}`
              : "Demandeur";
            const canUpdate = item.statut !== "ANNULEE" && item.statut !== "TERMINEE";
            const isUpdating = updatingId === item.id;

            return (
              <View style={styles.visitItem}>
                <Text style={styles.listingTitle}>{item.annonce?.titre ?? "Annonce"}</Text>
                <Text style={styles.location}>{requesterName}</Text>
                {item.utilisateur?.email && (
                  <Text style={styles.location}>{item.utilisateur.email}</Text>
                )}
                <Text style={styles.location}>
                  Visite souhaitée : {new Date(item.dateVisiteSouhaitee).toLocaleString("fr-FR")}
                </Text>
                <Text style={[styles.status, getStatusStyle(item.statut)]}>
                  {formatStatus(item.statut)}
                </Text>
                <Text style={styles.description}>{item.message}</Text>

                {canUpdate && (
                  <View style={styles.actionsRow}>
                    <Pressable
                      style={[styles.actionButton, styles.acceptButton]}
                      disabled={isUpdating}
                      onPress={() => void updateStatus(item.id, "ACCEPTEE")}
                    >
                      <Text style={styles.acceptButtonText}>
                        {isUpdating ? "..." : "Accepter"}
                      </Text>
                    </Pressable>
                    <Pressable
                      style={[styles.actionButton, styles.rejectButton]}
                      disabled={isUpdating}
                      onPress={() => void updateStatus(item.id, "REFUSEE")}
                    >
                      <Text style={styles.rejectButtonText}>
                        {isUpdating ? "..." : "Refuser"}
                      </Text>
                    </Pressable>
                  </View>
                )}
              </View>
            );
          }}
          ListEmptyComponent={
            <EmptyState title="Aucune demande" text="Les demandes reçues apparaîtront ici." />
          }
        />
      )}
    </View>
  );
}

function AgencyListingsScreen({
  token,
  onOpen,
}: {
  token: string;
  onOpen: (annonce: Annonce) => void;
}) {
  const [annonces, setAnnonces] = useState<Annonce[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);

      try {
        const response = await announcementApi.mine(token);
        setAnnonces(response.data);
      } catch (err) {
        Alert.alert("Annonces", err instanceof Error ? err.message : "Chargement impossible.");
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, [token]);

  return (
    <View style={styles.screen}>
      <View style={styles.screenContent}>
        <Text style={styles.screenTitle}>Mes annonces</Text>
        <Text style={styles.screenSubtitle}>Consultez vos annonces depuis le mobile.</Text>
      </View>
      {loading ? (
        <ActivityIndicator style={styles.loader} />
      ) : (
        <FlatList
          data={annonces}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <View>
              <ListingCard annonce={item} onPress={() => onOpen(item)} />
              <Text style={[styles.status, getListingStatusStyle(item.statut)]}>
                {item.statut === "PUBLIEE" ? "Publiée" : "Brouillon"}
              </Text>
            </View>
          )}
          ListEmptyComponent={
            <EmptyState title="Aucune annonce" text="Vos annonces apparaîtront ici." />
          }
        />
      )}
    </View>
  );
}

function AgencyProfileScreen({ token }: { token: string }) {
  const [form, setForm] = useState<AgencyForm>({
    name: "",
    description: "",
    siret: "",
    phone: "",
    website: "",
    address: "",
    city: "",
    postalCode: "",
    logo: "",
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const setField = (field: keyof AgencyForm, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  useEffect(() => {
    const load = async () => {
      setLoading(true);

      try {
        const agency = await agencyApi.me(token);
        setForm({
          name: agency.name ?? "",
          description: agency.description ?? "",
          siret: agency.siret ?? "",
          phone: agency.phone ?? "",
          website: agency.website ?? "",
          address: agency.address ?? "",
          city: agency.city ?? "",
          postalCode: agency.postalCode ?? "",
          logo: agency.logo ?? "",
        });
      } catch (err) {
        Alert.alert("Profil agence", err instanceof Error ? err.message : "Chargement impossible.");
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, [token]);

  const save = async () => {
    setSaving(true);

    try {
      await agencyApi.update(token, {
        name: form.name.trim(),
        description: form.description.trim() || undefined,
        siret: form.siret.trim(),
        phone: form.phone.trim() || undefined,
        website: form.website.trim() || undefined,
        address: form.address.trim(),
        city: form.city.trim(),
        postalCode: form.postalCode.trim(),
        logo: form.logo.trim() || undefined,
      });
      Alert.alert("Profil agence", "Vos informations ont été mises à jour.");
    } catch (err) {
      Alert.alert("Profil agence", err instanceof Error ? err.message : "Sauvegarde impossible.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.screenContent}>
      <Text style={styles.screenTitle}>Profil agence</Text>
      <Text style={styles.screenSubtitle}>Consultez et modifiez les informations publiques.</Text>

      {loading ? (
        <ActivityIndicator style={styles.loader} />
      ) : (
        <>
          <AppInput label="Nom de l'agence" value={form.name} onChangeText={(value) => setField("name", value)} />
          <AppInput label="SIRET" value={form.siret} onChangeText={(value) => setField("siret", value)} />
          <AppInput label="Téléphone" value={form.phone} onChangeText={(value) => setField("phone", value)} keyboardType="phone-pad" />
          <AppInput label="Site web" value={form.website} onChangeText={(value) => setField("website", value)} autoCapitalize="none" keyboardType="url" />
          <AppInput label="Adresse" value={form.address} onChangeText={(value) => setField("address", value)} />
          <AppInput label="Ville" value={form.city} onChangeText={(value) => setField("city", value)} />
          <AppInput label="Code postal" value={form.postalCode} onChangeText={(value) => setField("postalCode", value)} keyboardType="number-pad" />
          <AppInput label="Logo URL" value={form.logo} onChangeText={(value) => setField("logo", value)} autoCapitalize="none" />
          <AppInput
            label="Description"
            value={form.description}
            onChangeText={(value) => setField("description", value)}
            multiline
            style={styles.textAreaSmall}
          />

          <Pressable style={styles.primaryButton} onPress={save} disabled={saving}>
            <Text style={styles.primaryButtonText}>
              {saving ? "Sauvegarde..." : "Enregistrer"}
            </Text>
          </Pressable>
        </>
      )}
    </ScrollView>
  );
}

function getListingStatusStyle(status: Annonce["statut"]) {
  return status === "PUBLIEE" ? styles.statusSuccess : styles.statusPending;
}

export default function App() {
  const [auth, setAuth] = useState<AuthState>({ token: null, user: null });
  const [screen, setScreen] = useState<Screen>("home");
  const [authVisible, setAuthVisible] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>("login");
  const [selectedAnnonce, setSelectedAnnonce] = useState<Annonce | null>(null);
  const [homeAssistantMessage, setHomeAssistantMessage] = useState<string | null>(null);

  const openAuth = (mode: AuthMode = "login") => {
    setAuthMode(mode);
    setAuthVisible(true);
  };

  const logout = () => {
    setAuth({ token: null, user: null });
    setScreen("home");
  };

  const handleAuthenticated = (state: AuthState) => {
    setAuth(state);
    setScreen(state.user?.role === "AGENCY" ? "agencyDashboard" : "home");
  };

  const openAnnonce = useCallback(async (annonce: Annonce) => {
    setSelectedAnnonce(annonce);

    try {
      const response = await announcementApi.findOne(annonce.id);
      setSelectedAnnonce(response.data);
    } catch (err) {
      Alert.alert(
        "Annonce",
        err instanceof Error ? err.message : "Chargement du detail impossible.",
      );
    }
  }, []);

  const currentScreen = useMemo(() => {
    if (auth.user?.role === "AGENCY" && auth.token) {
      if (screen === "agencyVisits") {
        return <AgencyVisitsScreen token={auth.token} />;
      }

      if (screen === "agencyListings") {
        return (
          <AgencyListingsScreen
            token={auth.token}
            onOpen={(annonce) => setSelectedAnnonce(annonce)}
          />
        );
      }

      if (screen === "agencyProfile") {
        return <AgencyProfileScreen token={auth.token} />;
      }

      return (
        <AgencyDashboardScreen
          token={auth.token}
          onVisits={() => setScreen("agencyVisits")}
          onListings={() => setScreen("agencyListings")}
          onProfile={() => setScreen("agencyProfile")}
        />
      );
    }

    if (screen === "home") {
      return (
        <HomeScreen
          onSearch={() => setScreen("search")}
          onAssistant={(message) => {
            setHomeAssistantMessage(message);
            setScreen("assistant");
          }}
        />
      );
    }

    if (screen === "search") {
      return <SearchScreen onOpen={(annonce) => void openAnnonce(annonce)} />;
    }

    if (screen === "assistant") {
      return (
        <AssistantScreen
          key={homeAssistantMessage ?? "assistant"}
          initialMessage={homeAssistantMessage}
          onOpen={(annonce) => void openAnnonce(annonce)}
        />
      );
    }

    if (screen === "favorites" && auth.token) {
      return (
        <FavoritesScreen
          token={auth.token}
          onOpen={(annonce) => void openAnnonce(annonce)}
        />
      );
    }

    if (screen === "visits" && auth.token) {
      return <VisitsScreen token={auth.token} />;
    }

    if (screen === "profile" && auth.user) {
      return <ProfileScreen user={auth.user} onVisits={() => setScreen("visits")} />;
    }

    return (
      <EmptyState
        title="Connexion requise"
        text="Connectez-vous pour accéder à cet espace."
      />
    );
  }, [screen, auth, homeAssistantMessage, openAnnonce]);

  return (
    <SafeAreaView style={styles.app}>
      <StatusBar barStyle="dark-content" />
      <Header
        user={auth.user}
        onAuth={openAuth}
        onLogout={logout}
      />
      <View style={styles.main}>{currentScreen}</View>
      <BottomTabs active={screen} user={auth.user} onChange={setScreen} />
      <AuthModal
        visible={authVisible}
        mode={authMode}
        onClose={() => setAuthVisible(false)}
        onSwitchMode={setAuthMode}
        onAuthenticated={handleAuthenticated}
      />
      <DetailModal
        annonce={selectedAnnonce}
        token={auth.token}
        userRole={auth.user?.role ?? null}
        onClose={() => setSelectedAnnonce(null)}
        onRequireAuth={() => openAuth("login")}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  app: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderBottomColor: colors.border,
    borderBottomWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    paddingVertical: 14,
  },
  brand: {
    color: colors.primary,
    fontSize: 24,
    fontWeight: "800",
  },
  brandSubtitle: {
    color: colors.secondary,
    fontSize: 13,
    marginTop: 2,
  },
  main: {
    flex: 1,
  },
  screen: {
    flex: 1,
  },
  screenContent: {
    padding: 18,
  },
  screenTitle: {
    color: colors.primary,
    fontSize: 28,
    fontWeight: "800",
  },
  screenSubtitle: {
    color: colors.muted,
    fontSize: 15,
    lineHeight: 22,
    marginTop: 6,
  },
  heroCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 18,
    borderWidth: 1,
    padding: 22,
  },
  heroTitle: {
    color: colors.primary,
    fontSize: 34,
    fontWeight: "800",
    lineHeight: 40,
  },
  heroText: {
    color: colors.secondary,
    fontSize: 16,
    lineHeight: 25,
    marginTop: 14,
  },
  searchBox: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 18,
    borderWidth: 1,
    marginTop: 18,
    padding: 16,
  },
  sectionTitle: {
    color: colors.primary,
    fontSize: 20,
    fontWeight: "800",
  },
  textArea: {
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderRadius: 14,
    borderWidth: 1,
    color: colors.primary,
    minHeight: 96,
    marginTop: 14,
    padding: 14,
    textAlignVertical: "top",
  },
  textAreaSmall: {
    minHeight: 92,
    textAlignVertical: "top",
  },
  rowGap: {
    gap: 10,
    marginTop: 14,
  },
  primaryButton: {
    alignItems: "center",
    backgroundColor: colors.accent,
    borderRadius: 14,
    justifyContent: "center",
    minHeight: 50,
    paddingHorizontal: 16,
  },
  primaryButtonSmall: {
    alignItems: "center",
    backgroundColor: colors.primary,
    borderRadius: 999,
    minHeight: 42,
    paddingHorizontal: 16,
    justifyContent: "center",
  },
  primaryButtonText: {
    color: colors.primary,
    fontSize: 15,
    fontWeight: "800",
  },
  primaryButtonSmallText: {
    color: colors.surface,
    fontSize: 15,
    fontWeight: "800",
  },
  secondaryButton: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 14,
    borderWidth: 1,
    justifyContent: "center",
    minHeight: 50,
    paddingHorizontal: 16,
  },
  secondaryButtonText: {
    color: colors.primary,
    fontSize: 15,
    fontWeight: "700",
  },
  metricGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 18,
  },
  metricCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 16,
    borderWidth: 1,
    flexGrow: 1,
    minWidth: "30%",
    padding: 14,
  },
  metricValue: {
    color: colors.primary,
    fontSize: 28,
    fontWeight: "800",
  },
  metricLabel: {
    color: colors.secondary,
    fontSize: 12,
    fontWeight: "700",
    marginTop: 4,
  },
  actionsRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 14,
  },
  actionButton: {
    alignItems: "center",
    borderRadius: 12,
    flex: 1,
    justifyContent: "center",
    minHeight: 44,
  },
  acceptButton: {
    backgroundColor: colors.successSoft,
  },
  acceptButtonText: {
    color: colors.success,
    fontWeight: "800",
  },
  rejectButton: {
    backgroundColor: colors.dangerSoft,
  },
  rejectButtonText: {
    color: colors.danger,
    fontWeight: "800",
  },
  ghostButton: {
    borderColor: colors.border,
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  ghostButtonText: {
    color: colors.secondary,
    fontWeight: "700",
  },
  linkButton: {
    alignItems: "center",
    marginTop: 18,
  },
  linkText: {
    color: colors.secondary,
    fontWeight: "700",
  },
  tabs: {
    backgroundColor: colors.surface,
    borderTopColor: colors.border,
    borderTopWidth: 1,
    flexDirection: "row",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  tabItem: {
    alignItems: "center",
    borderRadius: 999,
    flex: 1,
    paddingVertical: 10,
  },
  tabItemActive: {
    backgroundColor: colors.primary,
  },
  tabLabel: {
    color: colors.secondary,
    fontSize: 12,
    fontWeight: "700",
  },
  tabLabelActive: {
    color: colors.surface,
  },
  filters: {
    gap: 10,
    marginTop: 16,
  },
  inputGroup: {
    marginTop: 14,
  },
  inputLabel: {
    color: colors.secondary,
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 6,
  },
  input: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 14,
    borderWidth: 1,
    color: colors.primary,
    minHeight: 50,
    paddingHorizontal: 14,
  },
  listContent: {
    gap: 14,
    padding: 18,
    paddingTop: 4,
  },
  listingCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 18,
    borderWidth: 1,
    overflow: "hidden",
  },
  listingImage: {
    backgroundColor: colors.border,
    height: 180,
    width: "100%",
  },
  imagePlaceholder: {
    alignItems: "center",
    justifyContent: "center",
  },
  imagePlaceholderText: {
    color: colors.secondary,
    fontWeight: "800",
  },
  listingBody: {
    padding: 14,
  },
  badgeRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 8,
  },
  badge: {
    alignSelf: "flex-start",
    backgroundColor: colors.accentSoft,
    borderRadius: 999,
    color: colors.primary,
    fontSize: 12,
    fontWeight: "800",
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  badgeMuted: {
    alignSelf: "flex-start",
    backgroundColor: colors.background,
    borderRadius: 999,
    color: colors.secondary,
    fontSize: 12,
    fontWeight: "700",
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  listingTitle: {
    color: colors.primary,
    fontSize: 18,
    fontWeight: "800",
    lineHeight: 24,
  },
  location: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 21,
    marginTop: 5,
  },
  price: {
    color: colors.primary,
    fontSize: 22,
    fontWeight: "800",
    marginTop: 10,
  },
  meta: {
    color: colors.secondary,
    fontSize: 13,
    marginTop: 8,
  },
  loader: {
    marginTop: 30,
  },
  emptyState: {
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 48,
  },
  emptyTitle: {
    color: colors.primary,
    fontSize: 20,
    fontWeight: "800",
  },
  emptyText: {
    color: colors.muted,
    lineHeight: 22,
    marginTop: 8,
    textAlign: "center",
  },
  modalPage: {
    backgroundColor: colors.background,
    flex: 1,
  },
  modalContent: {
    flex: 1,
    padding: 18,
  },
  modalHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  closeText: {
    color: colors.secondary,
    fontWeight: "800",
  },
  errorText: {
    backgroundColor: colors.dangerSoft,
    borderRadius: 12,
    color: colors.danger,
    marginTop: 14,
    padding: 12,
  },
  detailImage: {
    backgroundColor: colors.border,
    height: 280,
    width: "100%",
  },
  detailBody: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -24,
    padding: 18,
  },
  detailTitle: {
    color: colors.primary,
    fontSize: 26,
    fontWeight: "800",
    lineHeight: 32,
  },
  detailPrice: {
    color: colors.primary,
    fontSize: 30,
    fontWeight: "900",
    marginTop: 14,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginVertical: 18,
  },
  stat: {
    backgroundColor: colors.background,
    borderRadius: 14,
    padding: 12,
    width: "47%",
  },
  statLabel: {
    color: colors.muted,
    fontSize: 12,
  },
  statValue: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: "800",
    marginTop: 4,
  },
  description: {
    color: colors.secondary,
    fontSize: 15,
    lineHeight: 24,
    marginTop: 10,
  },
  agencyBox: {
    backgroundColor: colors.background,
    borderRadius: 16,
    marginVertical: 18,
    padding: 14,
  },
  agencyLabel: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: "800",
    textTransform: "uppercase",
  },
  agencyName: {
    color: colors.primary,
    fontSize: 18,
    fontWeight: "800",
    marginTop: 4,
  },
  overlay: {
    backgroundColor: "rgba(11, 22, 44, 0.35)",
    flex: 1,
    justifyContent: "flex-end",
  },
  visitCard: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 18,
  },
  chatContent: {
    gap: 12,
    padding: 18,
  },
  messageBubble: {
    borderRadius: 18,
    maxWidth: "88%",
    padding: 14,
  },
  userBubble: {
    alignSelf: "flex-end",
    backgroundColor: colors.primary,
  },
  assistantBubble: {
    alignSelf: "flex-start",
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
  },
  messageText: {
    color: colors.primary,
    fontSize: 15,
    lineHeight: 22,
  },
  userMessageText: {
    color: colors.surface,
  },
  chatInputBar: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderTopColor: colors.border,
    borderTopWidth: 1,
    flexDirection: "row",
    gap: 10,
    padding: 12,
  },
  chatInput: {
    backgroundColor: colors.background,
    borderRadius: 16,
    color: colors.primary,
    flex: 1,
    minHeight: 48,
    paddingHorizontal: 14,
  },
  sendButton: {
    alignItems: "center",
    backgroundColor: colors.accent,
    borderRadius: 16,
    height: 48,
    justifyContent: "center",
    paddingHorizontal: 14,
  },
  disabledButton: {
    opacity: 0.6,
  },
  sendButtonText: {
    color: colors.primary,
    fontWeight: "800",
  },
  chatError: {
    marginHorizontal: 18,
  },
  visitItem: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 18,
    borderWidth: 1,
    padding: 14,
  },
  status: {
    alignSelf: "flex-start",
    borderRadius: 999,
    fontSize: 12,
    fontWeight: "800",
    marginTop: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  statusSuccess: {
    backgroundColor: colors.successSoft,
    color: colors.success,
  },
  statusDanger: {
    backgroundColor: colors.dangerSoft,
    color: colors.danger,
  },
  statusPending: {
    backgroundColor: colors.accentSoft,
    color: colors.primary,
  },
  profileCard: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 18,
    borderWidth: 1,
    marginVertical: 18,
    padding: 24,
  },
  profileInitials: {
    backgroundColor: colors.primary,
    borderRadius: 999,
    color: colors.surface,
    fontSize: 24,
    fontWeight: "900",
    height: 72,
    lineHeight: 72,
    textAlign: "center",
    width: 72,
  },
  profileName: {
    color: colors.primary,
    fontSize: 22,
    fontWeight: "800",
    marginTop: 14,
  },
});
