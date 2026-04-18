import { Pressable, StyleSheet, Text } from 'react-native';
import { ClimbingRoute } from '../types/climbing';

type RouteListItemProps = {
  route: ClimbingRoute;
  onPress: (route: ClimbingRoute) => void;
};

export function RouteListItem({ route, onPress }: RouteListItemProps) {
  return (
    <Pressable onPress={() => onPress(route)} style={styles.item} accessibilityRole="button">
      <Text style={styles.name}>{route.name}</Text>
      <Text style={styles.meta}>
        {route.grade} · {route.style} · {route.lengthMetres}m
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  item: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#d9e2ec',
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#102a43',
  },
  meta: {
    marginTop: 2,
    color: '#486581',
  },
});
