import React, { PropTypes } from 'react';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import update from 'immutability-helper';

const style = {
  verticalAlign: 'bottom',
  margin: 5,
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
      tipoDisabled: this.props.familia === null,
    }
  }

  componentDidMount() {
    if(this.props.familias.length === 0)
    {
      this.props.getFamilias();
      this.props.getTipos();
    }
  }

  handleFamiliaChange(event, index, familia) {
    let tipo = null;
    let info = 1;
    const allowedTipos = getAllowedTipos(familia, this.props.tipos)
    if(allowedTipos.length === 1) {
      info = 2;
      tipo = allowedTipos[0].id_tipo;
    }
    this.setState(update(this.state, {
      tipoDisabled: {$set: false},
      allowedTipos: {$set: allowedTipos }
    }))
    this.props.setInfoText(info)
    this.props.setSelectedTipo(tipo)
    this.props.setSelectedFamilia(familia)
  }

  handleTipoChange(event, index, tipo) {
    this.props.setInfoText(2)
    this.props.setSelectedTipo(tipo)
  }

  render () {
    return (
      <div>
        <SelectField
          style={style}
          floatingLabelText="Familia"
          value={this.props.familia}
          onChange={this.handleFamiliaChange}
          disabled={this.props.isInputDisabled}
          errorText={(this.props.isMissingFamilia && this.props.familia === "") ?
            "Campo Família não pode ser deixado em branco" : ""}
          floatingLabelStyle={{color: 'grey'}}
        >
          {this.props.familias.map((familia) => (
            <MenuItem key={familia.id_familia} value={familia.id_familia} primaryText={familia.familia} />
          ))}
        </SelectField>
        &nbsp;
        <SelectField
          style={style}
          floatingLabelText="Tipo"
          value={this.props.tipo}
          onChange={this.handleTipoChange}
          disabled={this.state.tipoDisabled || this.props.isInputDisabled}
          errorText={(this.props.isMissingTipo && this.state.tipo === "") ?
            "Campo Tipo não pode ser deixado em branco" : ""}
          floatingLabelStyle={{color: 'grey'}}
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
  setInfoText: PropTypes.func.isRequired,
  tipos: PropTypes.array.isRequired,
  familias: PropTypes.array.isRequired,
  tipo: PropTypes.number,
  familia: PropTypes.number,
  isMissingTipo: PropTypes.bool.isRequired,
  isMissingFamilia: PropTypes.bool.isRequired,
  isInputDisabled: PropTypes.bool.isRequired,
};
