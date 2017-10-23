module.exports = exports = `SELECT EquipamentosMonitorados_patrimonio FROM
    (SELECT t1.EquipamentosMonitorados_patrimonio, t1.Estados_id_estado FROM HistoricoEquipamentos t1
      JOIN (
        SELECT EquipamentosMonitorados_patrimonio, MAX(timestamp) timestamp
        FROM HistoricoEquipamentos
        GROUP BY EquipamentosMonitorados_patrimonio
      ) t2
    ON t1.EquipamentosMonitorados_patrimonio = t2.EquipamentosMonitorados_patrimonio
    AND t1.timestamp = t2.timestamp) LastStates
  WHERE
    Estados_id_estado = ?`;
