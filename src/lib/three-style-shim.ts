import { Object3D } from "three";
import { extend } from "@react-three/fiber";

// Reactbits Beams injects a <style> tag inside a Canvas which Fiber treats as a Three object.
// This dummy Style object satisfies Fiber so the component can render while we apply the CSS separately.
class Style extends Object3D {}

extend({ Style });
