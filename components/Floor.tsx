import React from 'react';
import { View, Image } from 'react-native';
import Images from '../assets/Images';

interface Props {
    body: any;
}

const Floor: React.FC<Props> = ({body}) => {
        const width = body.bounds.max.x - body.bounds.min.x;
        const height = body.bounds.max.y - body.bounds.min.y;

        const x = body.position.x - width / 2;
        const y = body.position.y -height / 2;

        const imageIterations = Math.ceil(width / height);

        return(
            <View
            style={{
                position: 'absolute',
                top: y,
                left: x,
                width: width,
                height: height,
                overflow: 'hidden',
                flexDirection: 'row'
            }} >
                {Array.apply(null, Array(imageIterations)).map((el, idx) => {
                    return <Image
                    style={{width: width, height: height}} 
                    key={idx} 
                    source={Images.floor}
                    resizeMode='stretch'
                    />
                })}
            </View>
        )
}

export default Floor;
