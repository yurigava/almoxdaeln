module.exports = exports = function(req, res) {
  req.models.Requisicoes.find({ EstadosReq_id_estadosReq: 4 },
    function(err, requisicoes) {
      if(err)
        res.send(err)
      else {
        console.log(requisicoes.length)
        req.models.EquipamentosRequisicao
            .aggregate({Requisicoes_id_requisicao: requisicoes.map(requisicao => requisicao.id_requisicao)})
            .sum("quantidade").groupBy("Requisicoes_id_requisicao").get(function(err, quantidades) {
          if(err)
            res.send(err)
          else {
            var formattedReqs = [];
            req.models.Carrinhos.find({Requisicoes_id_requisicao: requisicoes.map(r => r.id_requisicao)},
              function(err, carrinhos) {
                if(err)
                  res.send(err)
                else {
                  requisicoes.forEach(function(requisicao, index) {
                    var carrinhosOfReq = carrinhos
                      .filter(carrinho => carrinho.Requisicoes_id_requisicao == requisicao.id_requisicao)
                          .map(carrinho => carrinho.id_carrinho);
                    formattedReqs.push({
                      idReq: requisicao.id_requisicao,
                      quantidade: quantidades[index].sum_quantidade,
                      user: requisicao.usuario,
                      materia: requisicao.materia,
                      carrinhos: carrinhosOfReq
                    });
                  });
                  res.send({code: "SUCCESS", reserves: formattedReqs});
                }
              }
            );
          }
        });
      }
    }
  );
}
