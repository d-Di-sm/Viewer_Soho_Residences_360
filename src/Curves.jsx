import { useMemo } from "react"
import * as THREE from "three"
import curvesData from "./curves_all.json"

export default function TerrenoLineasMultiples() {

  const curves = useMemo(() => {

    // Rotación 90° en eje X
    const rot = new THREE.Euler(- Math.PI / 2, 0, 0)
    const yOffset = .30  // subir 30 unidades en Y

    return Object.entries(curvesData).map(([name, pointArray]) => {

      const points = pointArray.map(p => {
        const v = new THREE.Vector3(p[0], p[1], p[2])

        // Rotar en X
        v.applyEuler(rot)

        // Subir en Y +30
        v.y += yOffset

        return v
      })

      // Curva ABIERTA
      const curve = new THREE.CatmullRomCurve3(points, false)

      // Interpolar puntos
      const interpolated = curve.getPoints(1280)

      // Geometría de la línea
      const geometry = new THREE.BufferGeometry().setFromPoints(interpolated)

      return { name, geometry }
    })

  }, [])

  return (
    <>
      {curves.map(({ name, geometry }) => (
        <line key={name} geometry={geometry}>
          <lineBasicMaterial color="#7B7B7B" />
        </line>
      ))}
    </>
  )
}
