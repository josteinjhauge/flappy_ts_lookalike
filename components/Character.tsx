import React from 'react';
import { View } from 'react-native';


interface Props {
    body: any;
    pose: '1' | '2' | '3';
}

const Character: React.FC<Props> = ({body, pose}) => {

    const width = body.bounds.max.x - body.bounds.min.x;
    const height = body.bounds.max.y - body.bounds.min.y;
    const x = body.position.x - width / 2;
    const y = body.position.y -height / 2;

    const wingOffset = pose === '2' ? height * 0.12 : height * 0.42;

    return(
            <View
                style={{
                    position: 'absolute',
                    left: x,
                    top: y,
                    width: width,
                    height: height,
                    borderRadius: height / 2,
                    backgroundColor: '#ffdf00',
                    borderColor: '#ff0000',
                    borderWidth: 4,
                }}
            >
                <View
                    style={{
                        position: 'absolute',
                        left: -width * 0.12,
                        top: wingOffset,
                        width: width * 0.48,
                        height: height * 0.34,
                        borderRadius: height,
                        backgroundColor: '#0067ff',
                    }}
                />
                <View
                    style={{
                        position: 'absolute',
                        right: -width * 0.2,
                        top: height * 0.35,
                        width: width * 0.35,
                        height: height * 0.22,
                        backgroundColor: '#ff0000',
                    }}
                />
            </View>
    )
    
}

export default Character;