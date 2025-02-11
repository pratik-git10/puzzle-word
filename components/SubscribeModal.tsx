import { StyleSheet, Text, View } from "react-native";
import { forwardRef, useCallback, useMemo } from "react";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  useBottomSheetModal,
} from "@gorhom/bottom-sheet";
import { useSafeAreaInsets } from "react-native-safe-area-context";
export type Ref = BottomSheetModal;

const SubscribeModal = forwardRef<Ref>((props, ref) => {
  const snapPoints = useMemo(() => ["90%"], []);
  const { dismiss } = useBottomSheetModal();
  const { bottom } = useSafeAreaInsets();

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        opacity={0.7}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        {...props}
        onPress={dismiss}
      />
    ),
    []
  );

  return (
    <BottomSheetModal
      ref={ref}
      index={0}
      backdropComponent={renderBackdrop}
      snapPoints={snapPoints}
      handleComponent={null}>
      <View style={styles.contentContainer}>
        <Text style={styles.textStyle}>More Fun Puzzles</Text>
        <Text style={styles.textStyle}>Coming Soon...</Text>
      </View>
    </BottomSheetModal>
  );
});

export default SubscribeModal;

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
  },
  textStyle: {
    fontSize: 24,
    fontWeight: "bold",
  },
});
