import React from 'react';
import { View, Image } from 'react-native';
import  Images from '../assets/Images';

interface Props {
    body: any;
}

const Pipe: React.FC<Props> = ({body}) => {
        const width = body.bounds.max.x - body.bounds.min.x;
        const height = body.bounds.max.y - body.bounds.min.y;
        
        const x = body.position.x - width / 2;
        const y = body.position.y -height / 2;

        const pipeRatio = 160 / width; //160 is the size of the image, if other size on recived image change this variable
        const pipeHeight = 33 * pipeRatio;
        const pipeIterations = Math.ceil(height / pipeHeight);

        return(
            <View
            style={{
                position: 'absolute',
                top: y,
                left: x,
                width: width,
                height: height,
                flexDirection: 'column',
                overflow: 'hidden'
            }} >
                {Array.apply(null, Array(pipeIterations)).map((el, idx) => {
                    return(
                        <Image
                            style={{width: width, height: pipeHeight}}
                            source={Images.pipeCore}
                            key={idx}
                            resizeMode='stretch'
                        />
                    ) 
                })} 
            </View>
        )
}

export default Pipe;