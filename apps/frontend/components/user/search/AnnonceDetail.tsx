"use client";

import { type FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CalendarDays,
  ImageOff,
  MapPin,
  Phone,
  Send,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import FavoriteButton from "@/components/user/favorites/FavoriteButton";
import { useAuth } from "@/hooks/useAuth";
import { getImageUrl } from "@/lib/image-url";
import announcementService from "@/services/announcement.service";
import visitRequestService from "@/services/visit-request.service";
import type { Annonce } from "@/types/announcement";

const typeBienLabel: Record<Annonce["typeBien"], string> = {
  APPARTEMENT: "Appartement",
  MAISON: "Maison",
  STUDIO: "Studio",
  TERRAIN: "Terrain",
  LOCAL_COMMERCIAL: "Local commercial",
  AUTRE: "Autre",
};

const typeAnnonceLabel: Record<Annonce["typeAnnonce"], string> = {
  VENTE: "Vente",
  LOCATION: "Location",
};

const getVisitRequestErrorMessage = (error: unknown) => {
  if (typeof error !== "object" || error === null || !("response" in error)) {
    return "Impossible d'envoyer la demande de visite.";
  }

  const response = (
    error as {
      response?: {
        data?: {
          message?: unknown;
        };
      };
    }
  ).response;

  return typeof response?.data?.message === "string"
    ? response.data.message
    : "Impossible d'envoyer la demande de visite.";
};

interface AnnonceDetailProps {
  id: string;
}

export default function AnnonceDetail({ id }: AnnonceDetailProps) {
  const { user, loading: authLoading } = useAuth();
  const [annonce, setAnnonce] = useState<Annonce | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [visitDialogOpen, setVisitDialogOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [requestedVisitDate, setRequestedVisitDate] = useState("");
  const [visitRequestError, setVisitRequestError] = useState<string | null>(
    null
  );
  const [visitRequestSuccess, setVisitRequestSuccess] = useState<string | null>(
    null
  );
  const [submittingVisitRequest, setSubmittingVisitRequest] = useState(false);
  const [phoneVisible, setPhoneVisible] = useState(false);

  useEffect(() => {
    const fetchAnnonce = async () => {
      try {
        const response = await announcementService.findOne(id);
        setAnnonce(response.data.data);
      } catch (err) {
        console.error("Erreur lors du chargement de l'annonce :", err);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    fetchAnnonce();
  }, [id]);

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-16 text-center text-muted-foreground">
        Chargement...
      </div>
    );
  }

  if (notFound || !annonce) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-16 text-center">
        <p className="text-lg font-medium text-foreground">
          Cette annonce est introuvable.
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          Elle a peut-être été supprimée ou dépubliée.
        </p>
        <Link
          href="/recherche"
          className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-[#0B162C] hover:underline"
        >
          <ArrowLeft size={16} />
          Retour à la recherche
        </Link>
      </div>
    );
  }

  const images = annonce.images ?? [];
  const agency = annonce.agency;

  const openVisitDialog = () => {
    setVisitRequestError(null);
    setVisitRequestSuccess(null);

    if (authLoading) {
      return;
    }

    if (!user) {
      setVisitRequestError("Connectez-vous pour demander une visite.");
      setVisitDialogOpen(true);
      return;
    }

    if (user.role !== "USER") {
      setVisitRequestError(
        "Seul un compte utilisateur peut demander une visite."
      );
      setVisitDialogOpen(true);
      return;
    }

    setVisitDialogOpen(true);
  };

  const submitVisitRequest = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setVisitRequestError(null);
    setVisitRequestSuccess(null);

    if (!requestedVisitDate) {
      setVisitRequestError("Choisissez une date de visite souhaitée.");
      return;
    }

    const visitDate = new Date(requestedVisitDate);

    if (visitDate <= new Date()) {
      setVisitRequestError("La date de visite doit être dans le futur.");
      return;
    }

    try {
      setSubmittingVisitRequest(true);
      await visitRequestService.create(annonce.id, {
        message,
        requestedVisitDate: visitDate.toISOString(),
      });
      setVisitRequestSuccess("Votre demande de visite a bien été envoyée.");
      setMessage("");
      setRequestedVisitDate("");
      setVisitDialogOpen(false);
    } catch (error) {
      setVisitRequestError(getVisitRequestErrorMessage(error));
    } finally {
      setSubmittingVisitRequest(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <Link
        href="/recherche"
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft size={16} />
        Retour aux résultats
      </Link>

      <div className="overflow-hidden rounded-2xl border border-border bg-gray-100">
        {images.length > 0 ? (
          <>
            <div className="h-80 w-full">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={getImageUrl(images[activeImage].url)}
                alt={annonce.titre}
                className="h-full w-full object-cover"
              />
            </div>
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto p-3">
                {images.map((img, index) => (
                  <button
                    key={img.id}
                    type="button"
                    onClick={() => setActiveImage(index)}
                    className={`h-16 w-24 shrink-0 overflow-hidden rounded-lg border-2 ${
                      index === activeImage
                        ? "border-[#5FC2BA]"
                        : "border-transparent"
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={getImageUrl(img.url)}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="flex h-80 flex-col items-center justify-center gap-2 text-muted-foreground">
            <ImageOff size={28} />
            Aucune image disponible
          </div>
        )}
      </div>

      <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-start">
        <div>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold text-foreground">
                {annonce.titre}
              </h1>
              <div className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                <MapPin size={14} />
                {annonce.adresse}, {annonce.ville}
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <Badge
                variant="outline"
                className="border-gray-200 bg-gray-50 text-gray-700"
              >
                {typeAnnonceLabel[annonce.typeAnnonce]}
              </Badge>
              <FavoriteButton announcementId={annonce.id} className="bg-white" />
            </div>
          </div>

          <p className="mt-4 text-2xl font-semibold text-[#0B162C]">
            {annonce.prix.toLocaleString("fr-FR")} €
          </p>

          <div className="mt-6 grid grid-cols-2 gap-4 rounded-2xl border border-border p-5 sm:grid-cols-4">
            <div>
              <p className="text-xs text-muted-foreground">Type de bien</p>
              <p className="font-medium text-foreground">
                {typeBienLabel[annonce.typeBien]}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Surface</p>
              <p className="font-medium text-foreground">{annonce.surface} m²</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Pièces</p>
              <p className="font-medium text-foreground">
                {annonce.nombrePieces}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Chambres</p>
              <p className="font-medium text-foreground">
                {annonce.nombreChambres}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Salles de bain</p>
              <p className="font-medium text-foreground">
                {annonce.nombreSallesBains}
              </p>
            </div>
            {annonce.etage != null && (
              <div>
                <p className="text-xs text-muted-foreground">Étage</p>
                <p className="font-medium text-foreground">{annonce.etage}</p>
              </div>
            )}
            {annonce.anneeConstruction != null && (
              <div>
                <p className="text-xs text-muted-foreground">
                  Année de construction
                </p>
                <p className="font-medium text-foreground">
                  {annonce.anneeConstruction}
                </p>
              </div>
            )}
          </div>

          <div className="mt-6">
            <h2 className="text-lg font-semibold text-foreground">
              Description
            </h2>
            <p className="mt-2 whitespace-pre-line text-sm leading-6 text-muted-foreground">
              {annonce.description}
            </p>
          </div>
        </div>

        <aside className="rounded-2xl border border-border bg-white p-5 shadow-sm lg:sticky lg:top-6">
          <div>
            <p className="text-xs font-medium uppercase text-muted-foreground">
              Agence
            </p>
            <p className="mt-1 font-semibold text-[#0B162C]">
              {agency?.name ?? "Agence immobilière"}
            </p>
            {agency?.city && (
              <p className="mt-1 text-sm text-muted-foreground">
                {agency.city}
              </p>
            )}
          </div>

          {agency?.description && (
            <p className="mt-4 max-h-16 overflow-hidden text-sm leading-5 text-muted-foreground">
              {agency.description}
            </p>
          )}

          <div className="mt-5 space-y-3">
            <Button
              type="button"
              className="h-10 w-full bg-[#0B162C] text-white hover:bg-[#1C2942]"
              onClick={openVisitDialog}
            >
              <CalendarDays className="size-4" />
              Demander une visite
            </Button>

            {agency?.phone && (
              <Button
                type="button"
                variant="outline"
                className="h-10 w-full"
                onClick={() => setPhoneVisible((current) => !current)}
              >
                <Phone className="size-4" />
                {phoneVisible ? agency.phone : "Voir le numéro"}
              </Button>
            )}
          </div>

          {visitRequestSuccess && (
            <p className="mt-3 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
              {visitRequestSuccess}
            </p>
          )}
        </aside>
      </div>

      <Dialog open={visitDialogOpen} onOpenChange={setVisitDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Demander une visite</DialogTitle>
          </DialogHeader>

          <form onSubmit={submitVisitRequest} className="space-y-4">
            <div className="space-y-1.5">
              <label
                htmlFor="visit-message"
                className="text-sm font-medium text-foreground"
              >
                Message
              </label>
              <textarea
                id="visit-message"
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                rows={4}
                className="w-full resize-none rounded-lg border border-input bg-transparent px-3 py-2 text-sm outline-none transition focus:border-ring focus:ring-3 focus:ring-ring/50"
                placeholder="Bonjour, je souhaite visiter ce bien."
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="requested-visit-date"
                className="text-sm font-medium text-foreground"
              >
                Date souhaitée
              </label>
              <Input
                id="requested-visit-date"
                type="datetime-local"
                value={requestedVisitDate}
                onChange={(event) => setRequestedVisitDate(event.target.value)}
              />
            </div>

            {visitRequestError && (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
                {visitRequestError}
              </p>
            )}

            <div className="flex justify-end gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setVisitDialogOpen(false)}
              >
                Annuler
              </Button>
              <Button
                type="submit"
                disabled={
                  submittingVisitRequest || !user || user.role !== "USER"
                }
                className="bg-[#0B162C] text-white hover:bg-[#1C2942]"
              >
                <Send className="size-4" />
                {submittingVisitRequest ? "Envoi..." : "Envoyer"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
