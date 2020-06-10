import React, {Component} from 'react';
import { View, Image } from 'react-native';
import Images from '../assets/Images';


export default class Pipe extends Component {
    render(){
        const width = this.props.body.bounds.max.x - this.props.body.bounds.min.x;
        const height = this.props.body.bounds.max.y - this.props.body.bounds.min.y;
        
        const x = this.props.body.position.x - width / 2;
        const y = this.props.body.position.y -height / 2;

        const pipeRatio = 160 / width; //160 is the size of the image, if other size on recived image change this variable
        const pipeHeight = 33 * pipeRatio;
        const pipeIterations = Math.ceil(height / pipeeHeight);

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
                    return <Image
                    style={{width: width, height: pipeHeight}}
                    source={Images.pipeCore}
                    key={idx}
                    resizeMode='stretch'
                />
                })} 
            </View>
        )
    }
}