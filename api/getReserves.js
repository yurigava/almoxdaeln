module.exports = exports = function(req, res) {
  req.models.Requisicoes.find(
    {
      EstadosReq_id_estadosReq: 3,
      dataDeUso: req.body.date,
      turno: req.body.shift
    },
    function(err, requisicoes) {
      if(err)
        res.send(err)
      else {
        req.models.EquipamentosRequisicao
            .aggregate({Requisicoes_id_requisicao: requisicoes.map(requisicao => requisicao.id_requisicao)})
            .sum("quantidade").groupBy("Requisicoes_id_requisicao").get(function(err, quantidades) {
          if(err)
            res.send(err)
          else {
            var formattedReqs = [];
            requisicoes.forEach(function(requisicao, index) {
              formattedReqs.push({
                idReq: requisicao.id_requisicao,
                quantidade: quantidades[index].sum_quantidade,
                user: requisicao.usuario,
                materia: requisicao.materia
              });
            })
            res.send({code: "SUCCESS", reserves: formattedReqs});
          }
        })
      }
    }
  )
}
