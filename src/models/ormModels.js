module.exports = function(db, cb) {
  var EquipamentosMonitorados = db.define("EquipamentosMonitorados", {
    patrimonio: {
      type: 'integer',
      required: true,
      unique: true,
      key: true
    }
  }, {autoFetchLimit: 2});

  var EquipamentosRequisicao = db.define("EquipamentosRequisicao", {
    id_EquipamentoRequisicao: {
      type: 'integer',
      unique: true,
      key: true
    },
    quantidade: {
      type: 'integer',
      required: true
    }
  });

  var Estados = db.define("Estados", {
    id_estado: {
      type: 'integer',
      size: 8,
      unique: true,
      key: true
    },
    estado: {
      type: 'text',
      size: 30,
      required: true
    }
  });

  var EstadosReq = db.define("EstadosReq", {
    id_estadosReq: {
      type: 'integer',
      size: 8,
      unique: true,
      key: true
    },
    estadoReq: {
      type: 'text',
      size: 30,
      required: true
    }
  });

  var Familias = db.define("Familias", {
    id_familia: {
      type: 'integer',
      unique: true,
      key: true
    },
    familia: {
      type: 'text',
      size: 50,
      required: true
    }
  });

  var HistoricoEquipamentos = db.define("HistoricoEquipamentos", {
    id_evento: {
      type: 'integer',
      unique: true,
      serial: true,
      key: true
    },
    timestamp: {
      type: 'date',
      time: true,
      required: false
    },
    observacao: {
      type: 'text',
      size: 45,
    },
    usuario: {
      type: 'text',
      size: 45,
      required: true
    },
  });

  var Requisicoes = db.define("Requisicoes", {
    id_requisicao: {
      type: 'integer',
      unique: true,
      key: true
    },
    materia: {
      type: 'text',
      size: 45,
      required: false
    },
    usuario: {
      type: 'text',
      size: 45,
      required: true
    },
    timestampDeUso: {
      type: 'date',
      time: true,
    }
  });

  var Tipos = db.define("Tipos", {
    id_tipo: {
      type: 'integer',
      unique: true,
      key: true
    },
    tipo: {
      type: 'text',
      size: 50,
      required: true
    }
  });

  EquipamentosMonitorados.hasOne("Estado", Estados, {
    required: true,
    field: "Estados_id_estado",
    autoFetch: true
  });

  EquipamentosMonitorados.hasOne("Tipo", Tipos, {
    required: true,
    field: "Tipos_id_tipo",
    autoFetch: true
  });

  EquipamentosRequisicao.hasOne("Tipo", Tipos, {
    required: false,
    field: "Tipos_id_tipo",
    autoFetch: true
  });

  EquipamentosRequisicao.hasOne("Requisicao", Requisicoes, {
    required: true,
    field: "Requisicoes_id_requisicao",
    autoFetch: true
  });

  EquipamentosRequisicao.hasOne("Familias", Requisicoes, {
    required: true,
    field: "Familias_id_familia",
    autoFetch: true
  });

  HistoricoEquipamentos.hasOne("EquipamentoMonitorado", EquipamentosMonitorados, {
    required: true,
    field: "EquipamentosMonitorados_patrimonio"
  });

  HistoricoEquipamentos.hasOne("Estado", Estados, {
    required: true,
    field: "Estados_id_estado"
  });

  Requisicoes.hasOne("EstadoReq", EstadosReq, {
    required: true,
    field: "EstadosReq_id_estadosReq"
  });

  Tipos.hasOne("Familia", Familias, {
    required: true,
    field: "Familias_id_familia",
    autoFetch: true
  });
  return cb();
};
