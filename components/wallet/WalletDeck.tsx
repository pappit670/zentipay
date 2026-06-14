import { Dimensions, Pressable, StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  type SharedValue,
} from 'react-native-reanimated';
import { space } from '../../constants/theme';
import { spring } from '../../constants/motion';
import type { Card } from '../../lib/store';
import { CARD_RATIO, CardArt } from './CardArt';

const WIDTH = Dimensions.get('window').width - space.px * 2;
const CARD_H = WIDTH / CARD_RATIO;
const PEEK = 72;
const GAP = 14;

/**
 * Apple-Wallet card deck (Inspo 1). Drag down to fan the deck open, drag up to
 * collapse (spring snap). Tap any card → its detail page.
 */
export function WalletDeck({ cards, onSelect }: { cards: Card[]; onSelect: (c: Card) => void }) {
  // default card last → fully visible at the bottom of the stack, on top.
  const ordered = [...cards].sort((a, b) => Number(a.isDefault) - Number(b.isDefault));
  const n = ordered.length;
  const progress = useSharedValue(0);
  const start = useSharedValue(0);

  const pan = Gesture.Pan()
    .activeOffsetY([-14, 14])
    .onBegin(() => {
      start.value = progress.value;
    })
    .onUpdate((e) => {
      progress.value = Math.max(0, Math.min(1, start.value + e.translationY / 320));
    })
    .onEnd(() => {
      progress.value = withSpring(progress.value > 0.4 ? 1 : 0, spring.gentle);
    });

  const containerStyle = useAnimatedStyle(() => ({
    height: interpolate(progress.value, [0, 1], [(n - 1) * PEEK + CARD_H, (n - 1) * (CARD_H + GAP) + CARD_H]),
  }));

  return (
    <GestureDetector gesture={pan}>
      <Animated.View style={[styles.deck, containerStyle]}>
        {ordered.map((card, i) => (
          <DeckCard key={card.id} card={card} index={i} progress={progress} onPress={() => onSelect(card)} />
        ))}
      </Animated.View>
    </GestureDetector>
  );
}

function DeckCard({
  card,
  index,
  progress,
  onPress,
}: {
  card: Card;
  index: number;
  progress: SharedValue<number>;
  onPress: () => void;
}) {
  const style = useAnimatedStyle(() => {
    const collapsedY = index * PEEK;
    const expandedY = index * (CARD_H + GAP);
    const collapsedScale = 1 - (index === 0 ? 0 : 0); // front-most scaling kept subtle
    return {
      transform: [
        { translateY: interpolate(progress.value, [0, 1], [collapsedY, expandedY]) },
        { scale: interpolate(progress.value, [0, 1], [0.96 + index * 0.013, 1]) },
      ],
    };
  });

  return (
    <Animated.View style={[styles.card, { zIndex: index }, style]}>
      <Pressable onPress={onPress}>
        <CardArt card={card} width={WIDTH} />
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  deck: { width: WIDTH, alignSelf: 'center' },
  card: { position: 'absolute', left: 0, right: 0, top: 0, shadowColor: '#000', shadowOpacity: 0.4, shadowRadius: 16, shadowOffset: { width: 0, height: 8 }, elevation: 8 },
});
