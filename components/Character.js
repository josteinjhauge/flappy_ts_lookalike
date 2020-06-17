import React from 'react';
import { Image } from 'react-native';
import Images from '../assets/Images';

const Character = ({body, pose}) => {

    const width = body.bounds.max.x - body.bounds.min.x;
    const height = body.bounds.max.y - body.bounds.min.y;
    const x = body.position.x - width / 2;
    const y = body.position.y -height / 2;

    let characterImage = Images['character' + pose];
    return(
            <Image
                style={{
                    position: 'absolute',
                    left: x,
                    top: y,
                    width: width,
                    height: height,
                }}
                source={characterImage}
                resizeMode='stretch'
            />
    )
    
}

export default Character;