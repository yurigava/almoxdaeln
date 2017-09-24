module.exports = exports = function(req, res) {
  req.models.Requisicoes.find(
    {
      //EstadosReq_id_estadosReq: 3,
      dataDeUso: req.body.date,
      turno: req.body.shift
    },
    function(err, requisicoes) {
      if(err)
        res.send(err)
      else {
        var formattedReqs = [];
        requisicoes.forEach(function(requisicao) {
          formattedReqs.push({
            idReq: requisicao.id_requisicao,
            quantidade: 0,
            user: requisicao.usuario,
            materia: requisicao.materia
          });
        })
        res.send({code: "SUCCESS", reserves: formattedReqs});
      }
    }
  )
}
