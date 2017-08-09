import React, { PropTypes } from 'react';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import update from 'immutability-helper';

const style = {
  verticalAlign: 'bottom',
  margin: 5,
};

const style_inline = {
  display: "inline-block",
  //width: '8%',
  //margin: '0 ',
  //border: '1px solid #000FFF',
};

const getAllowedTipos = (familia, tipos) => {
  if(familia !== null && tipos !== undefined)
    return tipos.filter(tipo =>
      tipo.Familias_id_familia === familia
    );
  else
    return [];
}


export default class EquipTypeSelector extends React.Component {

  constructor(props) {
    super(props);
    this.handleFamiliaChange = this.handleFamiliaChange.bind(this);
    this.handleTipoChange = this.handleTipoChange.bind(this);
    this.state = {
      allowedTipos: getAllowedTipos(this.props.familia, this.props.tipos),
    }
  }

  componentDidMount() {
    if(this.props.familias.length === 0)
      this.props.getFamilias();
    if(this.props.tipos.length === 0)
      this.props.getTipos();
  }

  handleFamiliaChange(event, index, familia) {
    if(familia == this.props.familia)
      return;
    let tipo = null;
    let info = 1;
    const allowedTipos = getAllowedTipos(familia, this.props.tipos)
    if(allowedTipos.length === 1) {
      info = 2;
      tipo = allowedTipos[0].id_tipo;
    }
    this.setState(update(this.state, {
      allowedTipos: {$set: allowedTipos }
    }))
    this.props.setInfoNumber(info)
    this.props.setSelectedTipo(this.props.name, tipo)
    this.props.setSelectedFamilia(this.props.name, familia)
  }

  handleTipoChange(event, index, tipo) {
    this.props.setInfoNumber(2)
    this.props.setSelectedTipo(this.props.name, tipo)
  }

  render () {
    return (
      <div>
        <SelectField
          floatingLabelText="Família"
          value={this.props.familia}
          onChange={this.handleFamiliaChange}
          disabled={this.props.isInputDisabled}
          autoWidth={true}
          errorText={(this.props.isMissingFamilia && this.props.familia === null) ?
            "Campo Família não pode ser deixado em branco" : ""}
          style={style_inline}
          floatingLabelStyle={{color: 'grey', left: '0px'}}
        >
          {this.props.familias.map((familia) => (
            <MenuItem key={familia.id_familia} value={familia.id_familia} primaryText={familia.familia} />
          ))}
        </SelectField>
        &nbsp;
        <SelectField
          floatingLabelText="Tipo"
          value={this.props.tipo}
          onChange={this.handleTipoChange}
          disabled={this.props.familia === null || this.props.isInputDisabled}
          autoWidth={true}
          errorText={(this.props.isMissingTipo && this.props.tipo === null) ?
            "Campo Tipo não pode ser deixado em branco" : ""}
          style={style_inline}
          floatingLabelStyle={{color: 'grey', left: '0px'}}
        >
          {this.state.allowedTipos.map((tipo) => (
            <MenuItem key={tipo.id_tipo} value={tipo.id_tipo} primaryText={tipo.tipo} />
          ))}
        </SelectField>
      </div>
    )
  }
}

EquipTypeSelector.propTypes = {
  getTipos: PropTypes.func.isRequired,
  getFamilias: PropTypes.func.isRequired,
  setSelectedTipo: PropTypes.func.isRequired,
  setSelectedFamilia: PropTypes.func.isRequired,
  setInfoNumber: PropTypes.func,
  name: PropTypes.string,
  tipos: PropTypes.array.isRequired,
  familias: PropTypes.array.isRequired,
  tipo: PropTypes.number,
  familia: PropTypes.number,
  isMissingTipo: PropTypes.bool.isRequired,
  isMissingFamilia: PropTypes.bool.isRequired,
  isInputDisabled: PropTypes.bool.isRequired,
};
