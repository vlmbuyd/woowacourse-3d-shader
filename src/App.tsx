import { Canvas } from '@react-three/fiber';
import './App.css';
import Items from './components/Item';
import { OrthographicCamera, ScrollControls } from '@react-three/drei';
import { items } from './assets/imgUrl';

function App() {
  const totalItems = items.length;

  return (
    <Canvas>
      <OrthographicCamera makeDefault zoom={1} position={[0, 0, 1]} />
      <ScrollControls pages={totalItems} damping={0.2} infinite={true}>
        <axesHelper args={[600]} />
        <gridHelper args={[100, 100]} />

        <Items totalItems={totalItems} />
      </ScrollControls>
    </Canvas>
  );
}

export default App;
