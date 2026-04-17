import { FlatList, StyleSheet, Text, View } from 'react-native';
import { CragCard } from '../components/CragCard';
import { Crag } from '../types/climbing';

type CragListScreenProps = {
  crags: Crag[];
  onSelectCrag: (crag: Crag) => void;
};

export function CragListScreen({ crags, onSelectCrag }: CragListScreenProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Irish Climbing Crags</Text>
      <Text style={styles.subtitle}>Choose a crag to browse routes.</Text>
      <FlatList
        data={crags}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <CragCard crag={item} onPress={onSelectCrag} />}
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
  title: {
    fontSize: 28,
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
