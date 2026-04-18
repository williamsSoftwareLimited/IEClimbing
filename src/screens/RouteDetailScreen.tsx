import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ClimbingRoute, Crag } from '../types/climbing';

type RouteDetailScreenProps = {
  crag: Crag;
  route: ClimbingRoute;
  onBack: () => void;
};

export function RouteDetailScreen({ crag, route, onBack }: RouteDetailScreenProps) {
  return (
    <View style={styles.container}>
      <Pressable onPress={onBack} accessibilityRole="button">
        <Text style={styles.back}>← Routes</Text>
      </Pressable>
      <Text style={styles.title}>{route.name}</Text>
      <Text style={styles.subtitle}>{crag.name}</Text>
      <View style={styles.detailCard}>
        <Text style={styles.meta}>Grade: {route.grade}</Text>
        <Text style={styles.meta}>Style: {route.style}</Text>
        <Text style={styles.meta}>Length: {route.lengthMetres}m</Text>
      </View>
      <Text style={styles.description}>{route.description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 56,
    backgroundColor: '#f0f4f8',
  },
  back: {
    color: '#035388',
    marginBottom: 12,
    fontWeight: '600',
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#102a43',
  },
  subtitle: {
    marginTop: 4,
    marginBottom: 14,
    color: '#486581',
  },
  detailCard: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#d9e2ec',
    borderRadius: 12,
    padding: 14,
    gap: 6,
  },
  meta: {
    color: '#334e68',
    fontWeight: '600',
  },
  description: {
    marginTop: 14,
    color: '#243b53',
    lineHeight: 20,
  },
});
