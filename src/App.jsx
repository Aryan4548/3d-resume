import { Canvas, useLoader, useFrame, useThree } from '@react-three/fiber'
import { useGLTF, OrbitControls, Environment, Text, Html } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import { useRef, Suspense, useEffect, useState } from 'react'
import * as THREE from 'three'
import './App.css'

// Floating Menu
function FloatingMenu({ setTarget }) {
  const items = [
    { label: 'About Me', position: [1.77, 1.17, 3.79] },
    { label: 'Projects', position: [-3.05, 0.26, -3.26] },
    { label: 'Contact', position: [1.77, 1.17, 3.79] },
    { label: 'Certifications', position: [3, 3, 8] }
  ]

  return (
    <group position={[-6.5, 0.8, 0]}>
      {items.map((item, i) => (
        <Text
          key={item.label}
          font="/fonts/Orbitron-Bold.ttf"
          fontSize={0.4}
          color="#ff00ff"
          anchorX="left"
          anchorY="middle"
          position={[0, -i * 1, 0]}
          onClick={() => setTarget(item.position, item.label)}
          onPointerOver={() => (document.body.style.cursor = 'pointer')}
          onPointerOut={() => (document.body.style.cursor = 'default')}
        >
          {item.label}
        </Text>
      ))}
    </group>
  )
}

// Posters
function ProjectsPoster({ posterVisible, setTarget, isMobile }) {
  const projects = [
    {
      title: 'Annie Shop',
      description: 'E-commerce store built with React, Express, and MongoDB.',
      github: 'https://github.com/Aryan4548/annie-shop-frontend',
      netlify: 'https://annie-shop.netlify.app/'
    },
    {
      title: '3D Resume',
      description: 'Interactive 3D resume using React Three Fiber.',
      github: 'https://github.com/Aryan4548/3d-resume',
      netlify: 'https://3d-resume-aryan.netlify.app'
    },
    {
      title: 'Whats Chat',
      description: 'An android chat application made using firebase that supports real time messaging .',
      github: 'https://github.com/Aryan4548/whats-chat-',
      Drive: 'https://drive.google.com/drive/folders/1-fdjy6RflVdWj7CgLlmvxB-Wd9XudEYJ'
    },
    {
      title: 'Musci ',
      description: 'A Music player that fetches json data from background and plays music along with displaying its data.',
      github: 'https://github.com/Aryan4548/Musci2.0-app',
      Drive: 'https://drive.google.com/drive/folders/1MhgTuovgZELUCBRCy3TPt8oEKGMNggvD'
    }
  ]

  const [index, setIndex] = useState(0)
  const nextProject = () => setIndex((index + 1) % projects.length)
  const prevProject = () => setIndex((index - 1 + projects.length) % projects.length)

  return (
    <Html
      position={isMobile ? [-0.5, 0.5, 8.2] : [-1.2, 0.7, 7.7]}
      transform
      rotation={[0, Math.PI, 0]}
      scale={isMobile ? 0.6 : 0.85}
      distanceFactor={isMobile ? 7 : 5}
      style={{ pointerEvents: 'auto' }}
    >
      <div style={{
        background: 'rgba(20,20,20,0.85)',
        padding: '25px',
        borderRadius: '15px',
        width: `420px`,
        color: 'white',
        textAlign: 'center',
        border: '2px solid #ff00ff',
        boxShadow: '0 0 30px rgba(255,0,255,0.5)',
        fontFamily: 'Orbitron, sans-serif',
        opacity: posterVisible ? 1 : 0,
        transition: 'opacity 1s ease'
      }}>
        <h2 style={{ color: '#ff00ff', marginBottom: '15px' }}>{projects[index].title}</h2>
        <p>{projects[index].description}</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', margin: '10px 0' }}>
          <a href={projects[index].github} target="_blank" rel="noopener noreferrer" style={{ color: '#ff00ff' }}>GitHub</a>
          <a href={projects[index].netlify} target="_blank" rel="noopener noreferrer" style={{ color: '#ff00ff' }}>Netlify</a>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <button onClick={prevProject} style={arrowBtnStyle}>⬅</button>
          <button onClick={() => setTarget([0, 2, 10], null, true)} style={backBtnStyle}>Back</button>
          <button onClick={nextProject} style={arrowBtnStyle}>➡</button>
        </div>
      </div>
    </Html>
  )
}

function ContactPoster({ posterVisible, setTarget, isMobile }) {
  return (
    <Html
      transform
      position={isMobile ? [0.3, 2.2, -3.0] : [0.3, 2.5, -3.0]}
      scale={isMobile ? 0.45 : 0.45}
      distanceFactor={isMobile ? 5 : 5}
      style={{ pointerEvents: 'auto' }}
    >
      <div style={{
        background: 'rgba(20,20,20,0.85)',
        padding: '25px',
        borderRadius: '15px',
        width: `520px`,
        color: 'white',
        textAlign: 'center',
        border: '2px solid #ff00ff',
        boxShadow: '0 0 30px rgba(255,0,255,0.5)',
        fontFamily: 'Orbitron, sans-serif',
        opacity: posterVisible ? 1 : 0,
        transition: 'opacity 1s ease'
      }}>
        <h2 style={{ color: '#ff00ff', marginBottom: '15px' }}>Contact Me</h2>
        <p>Reach out via email aryanyd6497@gmail.com or contact 9368640891</p>
        <button onClick={() => setTarget([0, 2, 10], null, true)} style={backBtnStyle}>Back</button>
      </div>
    </Html>
  )
}

// Model
function NoodleShop({ activeSection, posterVisible, setTarget, isMobile }) {
  const group = useRef()
  const { scene } = useGLTF('/models/noodle-shop.glb')
  const targetRotation = Math.PI * 2.2
  const overshootStart = targetRotation - Math.PI * 1.5
  const finalScale = 0.9
  const [phase, setPhase] = useState('rotate-in')

  useFrame((_, delta) => {
    if (!group.current || phase === 'done') return
    group.current.scale.lerp(new THREE.Vector3(finalScale, finalScale, finalScale), 0.05)

    if (phase === 'rotate-in') {
      group.current.rotation.y += delta * 1.2
      if (group.current.rotation.y >= targetRotation + 0.2) setPhase('settle')
    } else if (phase === 'settle') {
      group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, targetRotation, 0.1)
      if (Math.abs(group.current.rotation.y - targetRotation) < 0.01) {
        group.current.rotation.y = targetRotation
        setPhase('done')
      }
    }
  })

  useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh && child.material?.emissive) {
        child.layers.enable(1)
      }
    })
  }, [scene])

  return (
    <group ref={group} scale={[0.1, 0.1, 0.1]} position={[0, -1.5, 0]} rotation={[0, overshootStart, 0]}>
      <primitive object={scene} />
      {phase === 'done' && activeSection === 'About Me' && (
        <Html
          position={isMobile ? [-1.7, 2.1, -16] : [-1.1, 3.2, -5]}
          scale={isMobile ? 0.6 : 0.85}
          distanceFactor={5}
          style={{ pointerEvents: 'auto' }}
        >
          <div style={{
            background: 'rgba(20, 20, 20, 0.85)',
            padding: '30px',
            borderRadius: '15px',
            width: '500px',
            color: 'white',
            textAlign: 'center',
            border: '2px solid #ff00ff',
            boxShadow: '0 0 30px rgba(255,0,255,0.5)',
            fontFamily: 'Orbitron, sans-serif',
            opacity: posterVisible ? 1 : 0,
            transition: 'opacity 1s ease'
          }}>
            <h1 style={{ color: '#ff00ff' }}>About Me</h1>
            <p>Hi! I'm <b>Aryan Yadav</b>, a Full-Stack Developer skilled in Android Development, React, Node , java and have a knowledge of some more things like three.js , REST Api, etc</p>
            <button onClick={() => setTarget([0, 2, 10], null, true)} style={backBtnStyle}>Back</button>
          </div>
        </Html>
      )}
      {phase === 'done' && activeSection === 'Projects' && (
        <ProjectsPoster posterVisible={posterVisible} setTarget={setTarget} isMobile={isMobile} />
      )}
      {phase === 'done' && activeSection === 'Contact' && (
        <ContactPoster posterVisible={posterVisible} setTarget={setTarget} isMobile={isMobile} />
      )}
    </group>
  )
}

// Scene Content
function GroundPlane() {
  const texture = useLoader(THREE.TextureLoader, '/textures/ground-gradient-texture.png')
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.51, 0]}>
      <planeGeometry args={[50, 50]} />
      <meshStandardMaterial map={texture} side={THREE.DoubleSide} />
    </mesh>
  )
}

function SceneContent() {
  const { camera } = useThree()
  const targetRef = useRef(null)
  const [activeSection, setActiveSection] = useState(null)
  const [posterVisible, setPosterVisible] = useState(false)
  const [controlsEnabled, setControlsEnabled] = useState(true)
  const [scale, setScale] = useState(1)
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768
      setIsMobile(mobile)
      setScale(mobile ? 0.8 : 1)
    }
    window.addEventListener('resize', handleResize)
    handleResize()
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    camera.layers.enable(0)
    camera.layers.enable(1)
    camera.position.set(0, 2, isMobile ? 16 : 10)
    camera.lookAt(0, 0, 0)
  }, [camera, isMobile])

  useEffect(() => {
    if (!activeSection) {
      setScale(isMobile ? 0.8 : 1)
    }
  }, [activeSection, isMobile])

  useFrame(() => {
    if (targetRef.current) {
      camera.position.lerp(targetRef.current, 0.05)
      camera.lookAt(0, 0, 0)
      if (camera.position.distanceTo(targetRef.current) < 0.1) {
        camera.position.copy(targetRef.current)
        targetRef.current = null
        setControlsEnabled(!activeSection)
        if (activeSection) setTimeout(() => setPosterVisible(true), 500)
      }
    }
  })

  const handleMenuClick = (pos, label, unlock = false) => {
    setPosterVisible(false)
    setActiveSection(label)
    if (unlock) setControlsEnabled(true)
    targetRef.current = new THREE.Vector3(...pos)
  }

  return (
    <group scale={[scale, scale, scale]}>
      <Environment preset="city" />
      <color attach="background" args={['#000']} />
      <ambientLight intensity={1.2} />
      <directionalLight position={[5, 5, 5]} intensity={2} />
      <GroundPlane />
      <NoodleShop activeSection={activeSection} posterVisible={posterVisible} setTarget={handleMenuClick} isMobile={isMobile} />
      <FloatingMenu setTarget={handleMenuClick} />
      <EffectComposer>
        <Bloom intensity={1.5} luminanceThreshold={1.4} luminanceSmoothing={0.9} mipmapBlur />
      </EffectComposer>
      <OrbitControls enabled={controlsEnabled} enableZoom maxPolarAngle={Math.PI / 2.05} />
    </group>
  )
}

// Main App
function App() {
  return (
    <div style={{ height: '100vh', width: '100vw' }}>
      <Canvas camera={{ position: [0, 2, 10], fov: 45 }}>
        <Suspense fallback={null}>
          <SceneContent />
        </Suspense>
      </Canvas>
    </div>
  )
}

// Styles
const arrowBtnStyle = {
  padding: '8px 12px',
  border: 'none',
  borderRadius: '8px',
  background: '#ff00ff',
  color: 'white',
  cursor: 'pointer'
}

const backBtnStyle = {
  padding: '8px 14px',
  border: 'none',
  borderRadius: '8px',
  background: '#ff00ff',
  color: 'white',
  cursor: 'pointer',
  boxShadow: '0 0 10px rgba(255,0,255,0.7)'
}

export default App
