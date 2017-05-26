module.exports = function(db, cb) {
  var EquipamentosMonitorados = db.define("EquipamentosMonitorados", {
    patrimonio: {
      type: 'number',
      size: 32,
      required: true,
      unique: true,
      key: true
    }
  }, {autoFetchLimit: 2});

  var Estados = db.define("Estados", {
    id_estado: {
      type: 'number',
      size: 8,
      required: true,
      unique: true,
      key: true
    },
    estado: {
      type: 'text',
      size: 30,
      required: true
    }
  });

  var Familias = db.define("Familias", {
    id_familia: {
      type: 'number',
      size: 32,
      required: true,
      unique: true,
      key: true
    },
    familia: {
      type: 'text',
      size: 50,
      required: true
    }
  });

  var Tipos = db.define("Tipos", {
    id_tipo: {
      type: 'number',
      size: 32,
      required: true,
      unique: true,
      key: true
    },
    tipo: {
      type: 'text',
      size: 50,
      required: true
    }
  });

  EquipamentosMonitorados.hasOne("estado", Estados, {
    required: true,
    field: "Estados_id_estado",
    autoFetch: true
  });

  EquipamentosMonitorados.hasOne("tipo", Tipos, {
    required: true,
    field: "Tipos_id_tipo",
    autoFetch: true
  });

  Tipos.hasOne("familia", Familias, {
    required: true,
    field: "Familias_id_familia",
    autoFetch: true
  });
  return cb();
};
