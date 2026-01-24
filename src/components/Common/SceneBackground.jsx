import { getSceneBackground } from '../../utils/backgroundManager';

export default function SceneBackground({ sceneKey, children, className = 'prologue-screen' }) {
    const bgImage = getSceneBackground(sceneKey);

    return (
        <div
            className={className}
            style={{ '--bg-image': `url("${bgImage}")` }}
            data-background="true"
        >
            {children}
        </div>
    );
}
