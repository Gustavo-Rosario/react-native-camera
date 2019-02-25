import React from 'react';
import { Text, View, TouchableOpacity, Image, CameraRoll, ToastAndroid } from 'react-native';
import { Camera, Permissions, FileSystem } from 'expo';

export default class CameraExample extends React.Component {
  
  constructor(props){
    super(props);
    this.state = {
      imgRoll: null,
      img: null,
      hasCameraPermission: null,
      type: Camera.Constants.Type.back,
    };
    this.renderImg = this.renderImg.bind(this);
    this.renderCamera = this.renderCamera.bind(this);
  }

  async componentDidMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA, Permissions.CAMERA_ROLL);
    this.setState({ hasCameraPermission: status === 'granted' });
  }

  snap = async () => {
    if (this.camera) {
      //Tira a foto
      let photo = await this.camera.takePictureAsync();
      //Salva a foto no state da aplicação
      this.setState({img: photo});  
      //Salva a foto no rolo da camera. Podemos salvar em outro lugar futuramente
      //await CameraRoll.saveToCameraRoll(photo.uri, 'photo');
    }
  }

  // Esse metodo será utilizado futuramente para o botao SALVAR IMG após a pessoas tirar a foto
  save = async () => {
    const { img } = this.state; 
    await CameraRoll.saveToCameraRoll(img.uri, 'photo');
    this.toastRodape("Imagem salva");
    this.cancel();

  }

  toastRodape = (msg) => {
    ToastAndroid.showWithGravity(
      msg,
      ToastAndroid.SHORT,
      ToastAndroid.BOTTOM,
    );
  } 

  cancel = () => {
    this.setState({img: null})
  }

  renderImg(){
    const { img } = this.state;
    //Renderiza a img na tela. Os valores 400 e 700 sao numeros que coloquei de teste
    return (
      <View style={{flex:1}}>
        <Image 
          style={{
            width:400,
            height:700,
            resizeMode: 'cover',
          }}
          source={{uri: img.uri}}
        />
        <View
          style={{
            flex: 1,
            backgroundColor: 'transparent',
            flexDirection: 'row',
          }}
        >
        
          <TouchableOpacity
            style={{
              flex: 0.5,
              alignSelf: 'flex-end',
              alignItems: 'center',
            }}
            onPress={this.save}
          >
            <Text
              style={{
                width: 150,
                fontSize: 18,
                marginBottom: 10,
                color: 'white',
                backgroundColor: 'blue'
              }}
            >
              Save
            </Text>
          </TouchableOpacity>


          <TouchableOpacity
            style={{
              flex: 0.5,
              alignSelf: 'flex-end',
              alignItems: 'center',
            }}
            onPress={this.cancel}
          >
            <Text
              style={{
                width: 150,
                fontSize: 18,
                marginLeft: 100,
                marginBottom: 10,
                color: 'white',
                backgroundColor: 'blue'
              }}
            >
              Cancel
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  renderCamera() {
    //Exibe a camera na tela cheia
    return (
      <View style={{flex:1}}>
        <Camera
          ref={ref => {this.camera = ref;}}
          style={{ flex: 1 }}
          type={this.state.type}
          ratio="16:9">
          <View
            style={{
              flex: 1,
              backgroundColor: 'transparent',
              flexDirection: 'row',
            }}>
            

            <TouchableOpacity
              style={{
                flex: 0.5,
                alignSelf: 'flex-end',
                alignItems: 'center',
              }}
              onPress={this.snap}>
              <Text
                style={{
                  width: 150,
                  fontSize: 18,
                  marginBottom: 10,
                  color: 'white',
                  backgroundColor: 'blue'
                }}>
                {' '}Picture{' '}
              </Text>
            </TouchableOpacity>
          </View>
        </Camera>
      </View>
    );
  }

  render() {
    const { hasCameraPermission, img } = this.state;
    if (hasCameraPermission === null) { //Checa as permissoes
      return <View />;
    } else if (hasCameraPermission === false) { //Checa se permissoes foram negadas
      return <Text>No access to camera</Text>;
    } else {
      //Checa se há img salva no state para exibir
      let rendered = img ? this.renderImg() :  this.renderCamera();
      //Exibe um dos metodo
      return (
        <View style={{ flex: 1 }}>
          {rendered}
        </View>
      );
    }
  }
}