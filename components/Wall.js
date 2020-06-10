import React, {Component} from 'react';
import { View, Image } from 'react-native';

const wall = require('../assets/stone.jpg') // TODO: change this line to change the design of the walls

// TODO: also walls should be split up into different objects like obstecal, roof and floor

export default class Wall extends Component {
    render(){
        const width = this.props.size[0];
        const height = this.props.size[1];
        const x = this.props.body.position.x - width / 2;
        const y = this.props.body.position.y -height / 2;

        return(
            <View
            style={{
                position: 'absolute',
                top: y,
                left: x,
                width: width,
                height: height,
                backgroundColor: this.props.color
            }} >
               <Image
                    style={{width: width, height: height}}
                    source={wall}
                    resizeMode='stretch'
                />
            </View>
        )
    }
}