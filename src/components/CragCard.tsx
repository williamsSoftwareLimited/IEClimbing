import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Crag } from '../types/climbing';

type CragCardProps = {
  crag: Crag;
  onPress: (crag: Crag) => void;
};

export function CragCard({ crag, onPress }: CragCardProps) {
  return (
    <Pressable onPress={() => onPress(crag)} style={styles.card} accessibilityRole="button">
      <Text style={styles.title}>{crag.name}</Text>
      <Text style={styles.meta}>{crag.county}</Text>
      <Text style={styles.meta}>Approach: {crag.approachMinutes} mins</Text>
      <Text style={styles.meta}>Routes: {crag.routes.length}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    gap: 4,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#d9e2ec',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#102a43',
  },
  meta: {
    color: '#334e68',
  },
});
