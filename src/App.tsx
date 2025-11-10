import { Canvas } from '@react-three/fiber';
import './App.css';
import Items from './components/Item';
import { OrthographicCamera, ScrollControls } from '@react-three/drei';
import { items } from './assets/imgUrl';
import ScrollSnapper from './components/ScrollSnapper';

function App() {
  const totalItems = items.length;

  const isInfinite = totalItems >= 4;

  return (
    <Canvas>
      <OrthographicCamera makeDefault zoom={1} position={[0, 0, 1]} />
      <ScrollControls
        pages={totalItems}
        damping={0.1}
        infinite={isInfinite}
        enabled={totalItems > 1}
        maxSpeed={1.5}
      >
        <axesHelper args={[600]} />
        <gridHelper args={[100, 100]} />

        <Items totalItems={totalItems} isInfinite={isInfinite} />

        <ScrollSnapper totalItems={totalItems} isInfinite={isInfinite} />
      </ScrollControls>
    </Canvas>
  );
}

export default App;
