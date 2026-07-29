import type { ComponentType, ReactElement } from "react";
import {
  ActivityIndicator as RNActivityIndicator,
  FlatList as RNFlatList,
  Image as RNImage,
  KeyboardAvoidingView as RNKeyboardAvoidingView,
  Modal as RNModal,
  Pressable as RNPressable,
  SafeAreaView as RNSafeAreaView,
  ScrollView as RNScrollView,
  StatusBar as RNStatusBar,
  Text as RNText,
  TextInput as RNTextInput,
  View as RNView,
} from "react-native";
import type {
  ActivityIndicatorProps,
  ImageProps,
  KeyboardAvoidingViewProps,
  ModalProps,
  PressableProps,
  ScrollViewProps,
  StatusBarProps,
  TextInputProps,
  TextProps,
  ViewProps,
} from "react-native";

type AppFlatListProps<ItemT> = {
  data: readonly ItemT[] | null | undefined;
  keyExtractor?: (item: ItemT, index: number) => string;
  renderItem: (info: { item: ItemT; index: number }) => ReactElement | null;
  contentContainerStyle?: unknown;
  ListEmptyComponent?: ReactElement | ComponentType<unknown> | null;
};

export const ActivityIndicator =
  RNActivityIndicator as unknown as ComponentType<ActivityIndicatorProps>;
export const Image = RNImage as unknown as ComponentType<ImageProps>;
export const KeyboardAvoidingView =
  RNKeyboardAvoidingView as unknown as ComponentType<KeyboardAvoidingViewProps>;
export const Modal = RNModal as unknown as ComponentType<ModalProps>;
export const Pressable = RNPressable as unknown as ComponentType<PressableProps>;
export const SafeAreaView =
  RNSafeAreaView as unknown as ComponentType<ViewProps>;
export const ScrollView = RNScrollView as unknown as ComponentType<ScrollViewProps>;
export const StatusBar = RNStatusBar as unknown as ComponentType<StatusBarProps>;
export const Text = RNText as unknown as ComponentType<TextProps>;
export const TextInput = RNTextInput as unknown as ComponentType<TextInputProps>;
export const View = RNView as unknown as ComponentType<ViewProps>;

export const FlatList = RNFlatList as unknown as <ItemT>(
  props: AppFlatListProps<ItemT>,
) => ReactElement | null;
