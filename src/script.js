import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
const canvas = document.querySelector('canvas.webgl')

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}
// Scene
const scene = new THREE.Scene()
scene.fog = new THREE.Fog( '#262837', 1, 15 );

/**
 * Textures
 */
const loadingManager = new THREE.LoadingManager();
const textureLoader = new THREE.TextureLoader(loadingManager)
const DoorColor = textureLoader.load("./color.jpg");
const DoorAlpha = textureLoader.load("./textures/door/alpha.jpg");
const DoorHeight = textureLoader.load("./texturs/door/height.jpg");
const DoorMetallnes = textureLoader.load("./textures/door/metalness.jpg");
const DoorNormal = textureLoader.load("./textures/door/normal.jpg");
const DoorRoughness = textureLoader.load("./textures/door/roughness.jpg");

const WallsColor = textureLoader.load("./color2.jpg");
const WallsNormal = textureLoader.load("./textures/bricks/normal.jpg");
const WallsRoughness = textureLoader.load("./textures/bricks/roughness.jpg");
const WallsOcclusion = textureLoader.load("./textures/bricks/ambientOcclusion.jpg")

const GrassColor = textureLoader.load("./textures/grass/color.jpg");
const GrassNormal = textureLoader.load("./textures/grass/normal.jpg");
const GrassRoughness = textureLoader.load("./textures/grass/roughness.jpg");
const GrassOcclusion = textureLoader.load("./textures/grass/ambientOcclusion.jpg")

const WindowTextures = textureLoader.load("./window.jpg");

const house = new THREE.Group()
scene.add(house)

// Стены
const walls = new THREE.Mesh(
    new THREE.BoxGeometry(5,3,5),
    new THREE.MeshStandardMaterial({
        map:WallsColor,
        normalMap:WallsNormal,
        roughnessMap:WallsRoughness,
        displacementScale:0.1,
        aoMap:WallsOcclusion,
    })
)
walls.position.y = 1.27
house.add(walls)

//Крыша
const roof = new THREE.Mesh(
    new THREE.ConeGeometry(3.7,2,4),
    new THREE.MeshStandardMaterial({color:'#D2691E'})
)
roof.position.y = 3.7;
roof.rotation.y = Math.PI * 0.25
house.add(roof)

// Дверь
const door = new THREE.Mesh(
    new THREE.PlaneGeometry(2,2),
    new THREE.MeshStandardMaterial({
        map:DoorColor,
        alphaMap:DoorAlpha,
        transparent:true,
        displacementMap:DoorHeight,
        displacementScale:0.2,
        normalMap:DoorNormal,
        metalnessMap:DoorMetallnes,
        roughnessMap:DoorRoughness,
    })
)
door.geometry.setAttribute('uv2', new THREE.Float32BufferAttribute(door.geometry.attributes.uv.array,2))
walls.geometry.setAttribute('uv2', new THREE.Float32BufferAttribute(walls.geometry.attributes.uv.array,2))

door.position.z = 2.5 + 0.01
door.position.y = 0.85 
house.add(door)


// Кусты
const Custs = new THREE.SphereGeometry(0.6,16,16)
const CustsMaterial = new THREE.MeshStandardMaterial({color:'#008000'})
const bush1 = new THREE.Mesh(Custs,CustsMaterial)
const bush2 = new THREE.Mesh(Custs,CustsMaterial)
bush1.position.set(1.8,0.5,3)
bush2.position.set(-1.8,0.5,3)
house.add(bush1,bush2)


// Эллементы вокруг
const GravesGroup = new THREE.Group()
house.add(GravesGroup);
const Grave = new THREE.BoxGeometry(0.7,1.8,0.25);
const GraveMaterial = new THREE.MeshStandardMaterial({color:'#008000'});
for (let i = 0;i<50;i++){
    const angel = Math.random() * Math.PI * 2
    const radius = 4 + Math.random() * 10
    const x = Math.sin(angel) * radius
    const z = Math.cos(angel) * radius
    const NewGrave = new THREE.Mesh(Grave,GraveMaterial)
    NewGrave.castShadow = true
    NewGrave.position.set(x,0.3,z)
    NewGrave.rotation.x = Math.random() / 3
    NewGrave.rotation.y = Math.random() / 4
    GravesGroup.add(NewGrave);
}

// Floor
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(30, 30),
    new THREE.MeshStandardMaterial({
        map:GrassColor,
        normalMap:GrassNormal,
        aoMap:GrassOcclusion,
        roughnessMap:GrassRoughness,
    })
)
floor.receiveShadow = true
floor.geometry.setAttribute('uv2', new THREE.Float32BufferAttribute(floor.geometry.attributes.uv.array,2))

// Window 
const Window = new THREE.Mesh(
    new THREE.PlaneGeometry(1,1),
    new THREE.MeshStandardMaterial({
        map: WindowTextures,
    })
)
const Window2 = new THREE.Mesh(
    new THREE.PlaneGeometry(1,1),
    new THREE.MeshStandardMaterial({
        map: WindowTextures,
    })
)
Window.position.z = 2.5 + 0.01  
Window.position.x = 1.5
Window.position.y = 1.5
house.add(Window)

Window2.position.z = 2.5 + 0.01  
Window2.position.x = -1.5
Window2.position.y = 1.5
house.add(Window2)


GrassColor.repeat.set(8,8);
GrassNormal.repeat.set(8,8);
GrassRoughness.repeat.set(8,8);
GrassOcclusion.repeat.set(8,8);

GrassColor.wrapS = THREE.RepeatWrapping
GrassNormal.wrapS = THREE.RepeatWrapping
GrassRoughness.wrapS = THREE.RepeatWrapping
GrassOcclusion.wrapS = THREE.RepeatWrapping

GrassColor.wrapT = THREE.RepeatWrapping
GrassNormal.wrapT = THREE.RepeatWrapping
GrassRoughness.wrapT = THREE.RepeatWrapping
GrassOcclusion.wrapT = THREE.RepeatWrapping

floor.rotation.x = - Math.PI * 0.5
floor.position.y = 0
floor.receiveShadow = true
scene.add(floor)

// Ambient light
const ambientLight = new THREE.AmbientLight('#b9d5ff', 0.12)
scene.add(ambientLight)

// Directional light
const moonLight = new THREE.DirectionalLight('#b9d5ff', 0.12)
moonLight.position.set(4, 5, - 2)
scene.add(moonLight)
// PointLight
const doorlight = new THREE.PointLight("#ff7d47",2,7)
doorlight.position.set(0,2,3.2)
house.add(doorlight)

const light1 = new THREE.PointLight("#FFFFE0",2,3)
scene.add(light1)
light1.castShadow = true
light1.shadow.mapSize.width = 215;
light1.shadow.mapSize.height = 215;
light1.shadow.far = 2
light1.shadow.near = 1

const light2 = new THREE.PointLight("#FFFFE0",2,3)
scene.add(light2)
light1.castShadow = true
light2.shadow.mapSize.width = 215;
light2.shadow.mapSize.height = 215;
light2.shadow.far = 2
light2.shadow.near = 1

window.addEventListener('resize', () =>
{
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 4
camera.position.y = 2
camera.position.z = 5
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setClearColor("#262837")
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
/**
 * Animate
 */
const clock = new THREE.Clock()
const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    const LightAngle1 = elapsedTime * 2
    light1.position.x = Math.sin(LightAngle1) * 4
    light1.position.z = Math.cos(LightAngle1) * 4
    light1.position.y = Math.sin(LightAngle1) * 3;

    const LightAngle2 = elapsedTime * 2
    light2.position.x = Math.sin(LightAngle2) * -4
    light2.position.z = -Math.cos(LightAngle2) * -4
    light2.position.y = Math.sin(LightAngle2) * 3;

    controls.update()
    renderer.render(scene, camera)
    window.requestAnimationFrame(tick)
}
tick()