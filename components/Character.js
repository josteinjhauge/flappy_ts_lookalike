import React, {Component} from 'react';
import { View, Image} from 'react-native';
import Images from '../assets/Images';

export default class Character extends Component {
    render(){
        const width = this.props.body.bounds.max.x - this.props.body.bounds.min.x;
        const height = this.props.body.bounds.max.y - this.props.body.bounds.min.y;
        const x = this.props.body.position.x - width / 2;
        const y = this.props.body.position.y -height / 2;

        let characterImage = Images['character' + this.props.pose];
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
}