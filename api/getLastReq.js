module.exports = exports = function(req, res) {
  var usuario = req.body.usuario;
  var equips = [];
  var requisicoesInfo = [];
  const TurnoReserve = [
    'Manhã',
    'Tarde',
    'Noite'
  ];
  req.models.Requisicoes.find({usuario: usuario}, 3, ["id_requisicao", "Z"], function (err, requisicoes) {
    if(err)
      res.send(err);    
    if(requisicoes.length < 1) {
      res.send({ code: "NOTHING", equipamentos: 0, requisicoes: 0 });
    }
    else {
      //console.log(requisicoes[2].id_requisicao + " / " + requisicoes[1].id_requisicao + " / " + requisicoes[0].id_requisicao);
      var idrequisicoes = requisicoes.map(equip => equip.id_requisicao);
      //var requisicoesInfo = requisicoes.map(equip => equip.id_requisicao, equip.materia, equip.dataDeUso, equip.turno );
      
      requisicoes.forEach(function (campo) {
        var data = campo.dataDeUso;
        dataAtual = (("0" + data.getDate()).slice(-2) + '-' + ("0" + (data.getMonth()+1)).slice(-2) + '-' + data.getFullYear());
        requisicoesInfo.push({
          id: campo.id_requisicao,
          materia: campo.materia,
          dataDeUso: dataAtual,
          turno: TurnoReserve[campo.turno]
        });
      });
      requisicoesInfo.forEach(function (campo) {
        console.log("reqid: " + campo.id +  " materia: " + campo.materia + " dataDeUso: " + campo.dataDeUso + " turno: " + campo.turno);
      });
      req.models.EquipamentosRequisicao.find({Requisicoes_id_requisicao: idrequisicoes}, function (err, equipamento) {  
        if(err)
          res.send(err);          
        equipamento.forEach(function (campo) {
          equips.push({
            id: campo.Requisicoes_id_requisicao,
            familia: campo.Familias_id_familia,
            tipo: campo.Tipos_id_tipo,
            quantidade: campo.quantidade
          });
        });
        equips.forEach(function (campo) {
          //console.log(campo);
          console.log("id: " + campo.id +  " quantidade: " + campo.quantidade + " familia: " + campo.familia + " tipo: " + campo.tipo);
        });
        //console.log("i["+i+"] length: " + requisicoes.length);
        //if(i>=requisicoes.length) {
          res.send({ code: "SUCCESS", equipamentos: equips, requisicoes: requisicoesInfo });
        //}
      });
    }
  });
};
