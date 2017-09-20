module.exports = exports = function(req, res) {
  var usuario = req.body.usuario;
  var i=0;
  req.models.Requisicoes.find({usuario: usuario}, 3, ["id_requisicao", "Z"], function (err, requisicao) {
    if(err)
      res.send(err);
    else
      console.log(requisicao[2].id_requisicao + " / " + requisicao[1].id_requisicao + " / " + requisicao[0].id_requisicao);
      requisicao.forEach(function (equip) {
        req.models.EquipamentosRequisicao.find({Requisicoes_id_requisicao: equip.id_requisicao}, function (err, equipamento) {  
          if(err)
            res.send(err);
          i++;
          var equips = [];
          equipamento.forEach(function (campo) {
            equips.push({
              id: campo.Requisicoes_id_requisicao,
              familia: campo.Familias_Id_familia,
              quantidade: campo.quantidade,
              id_EquipamentoRequisicao: campo.id_EquipamentoRequisicao,
            });
          });
          equips.forEach(function (campo) {
            //console.log(campo);
            console.log("id: " + campo.id +  " quantidade: " + campo.quantidade + " id_EquipamentoRequisicao: " + campo.id_EquipamentoRequisicao + " familia: " + campo.familia);
          });
          console.log("i["+i+"] length: " + requisicao.length);
          if(i>=requisicao.length) {
            res.send({ code: "SUCCESS", equipamento: equips });
          }
        });
      });
  });
};
