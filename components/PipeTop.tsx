import React from 'react';
import { View } from 'react-native';

interface Props {
    body: any;
}

const PipeTop: React.FC<Props> = ({body}) => {
    const width = body.bounds.max.x - body.bounds.min.x;
    const height = body.bounds.max.y - body.bounds.min.y;
    const x = body.position.x - width / 2;
    const y = body.position.y -height / 2;

    return(
        <View
        style={{
            position: 'absolute',
            left: x,
            top: y,
            width: width,
            height: height,
            backgroundColor: '#ff0000',
            borderColor: '#ffdf00',
            borderWidth: 4,
        }}
        />
    )
}

export default PipeTop;