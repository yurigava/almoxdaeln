module.exports = exports = `SELECT EquipamentosMonitorados_patrimonio FROM
    (SELECT t1.EquipamentosMonitorados_patrimonio, t1.Estados_id_estado, t1.usuario FROM HistoricoEquipamentos t1
      JOIN (
        SELECT EquipamentosMonitorados_patrimonio, usuario, MAX(timestamp) timestamp
        FROM HistoricoEquipamentos
        WHERE usuario = ?
        GROUP BY EquipamentosMonitorados_patrimonio
      ) t2
    ON t1.EquipamentosMonitorados_patrimonio = t2.EquipamentosMonitorados_patrimonio
    AND t1.timestamp = t2.timestamp
    AND t1.usuario = t2.usuario) LastStates
  WHERE
    Estados_id_estado = ?`;
