import React from 'react';
import { View } from 'react-native';

interface Props {
    body: any;
}

const Floor: React.FC<Props> = ({body}) => {
        const width = body.bounds.max.x - body.bounds.min.x;
        const height = body.bounds.max.y - body.bounds.min.y;

        const x = body.position.x - width / 2;
        const y = body.position.y -height / 2;

        return(
            <View
            style={{
                position: 'absolute',
                top: y,
                left: x,
                width: width,
                height: height,
                backgroundColor: '#ffdf00',
                borderTopColor: '#ff0000',
                borderTopWidth: 8,
            }}
            />
        )
}

export default Floor;
