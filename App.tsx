import { useMemo, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { mockCrags } from './src/data/mockCrags';
import { Crag, ClimbingRoute } from './src/types/climbing';
import { CragListScreen } from './src/screens/CragListScreen';
import { RouteListScreen } from './src/screens/RouteListScreen';
import { RouteDetailScreen } from './src/screens/RouteDetailScreen';

export default function App() {
  const [selectedCrag, setSelectedCrag] = useState<Crag | null>(null);
  const [selectedRoute, setSelectedRoute] = useState<ClimbingRoute | null>(null);

  const currentScreen = useMemo(() => {
    if (!selectedCrag) {
      return <CragListScreen crags={mockCrags} onSelectCrag={setSelectedCrag} />;
    }

    if (!selectedRoute) {
      return (
        <RouteListScreen
          crag={selectedCrag}
          onBack={() => setSelectedCrag(null)}
          onSelectRoute={setSelectedRoute}
        />
      );
    }

    return (
      <RouteDetailScreen
        crag={selectedCrag}
        route={selectedRoute}
        onBack={() => setSelectedRoute(null)}
      />
    );
  }, [selectedCrag, selectedRoute]);

  return (
    <>
      {currentScreen}
      <StatusBar style="auto" />
    </>
  );
}
