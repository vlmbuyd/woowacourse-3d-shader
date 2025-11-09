import { Canvas } from '@react-three/fiber';
import './App.css';
import Items from './components/Item';
import { OrthographicCamera, ScrollControls } from '@react-three/drei';
import { items } from './assets/imgUrl';

function App() {
  const totalPages = items.length;

  return (
    <Canvas>
      <OrthographicCamera makeDefault zoom={1} position={[0, 0, 1]} />
      <ScrollControls pages={totalPages} damping={0.2}>
        <axesHelper args={[600]} />
        <gridHelper args={[100, 100]} />
        <Items totalPages={totalPages} />
      </ScrollControls>
    </Canvas>
  );
}

export default App;
