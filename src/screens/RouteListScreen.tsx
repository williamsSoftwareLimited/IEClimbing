import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { RouteListItem } from '../components/RouteListItem';
import { ClimbingRoute, Crag } from '../types/climbing';

type RouteListScreenProps = {
  crag: Crag;
  onBack: () => void;
  onSelectRoute: (route: ClimbingRoute) => void;
};

export function RouteListScreen({ crag, onBack, onSelectRoute }: RouteListScreenProps) {
  return (
    <View style={styles.container}>
      <Pressable onPress={onBack} accessibilityRole="button">
        <Text style={styles.back}>← All crags</Text>
      </Pressable>
      <Text style={styles.title}>{crag.name}</Text>
      <Text style={styles.subtitle}>{crag.county} · Approach {crag.approachMinutes} mins</Text>
      <FlatList
        data={crag.routes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <RouteListItem route={item} onPress={onSelectRoute} />}
        contentContainerStyle={styles.listContent}
      />
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
  listContent: {
    paddingBottom: 24,
  },
});
