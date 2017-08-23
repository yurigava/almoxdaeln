module.exports = exports = function(req, res) {
  var equipFamilia = req.body.familia;
  var equipTipo = req.body.tipo;
  var name = req.body.name;
  var date = req.body.date;
  var turno = req.body.turno;
  var quantidadeReq = [];
  console.log("familia: " + equipFamilia + " tipo: " + equipTipo + " name: " + name + " date: " + date + " turno: " + turno);

  if (equipTipo === null) {
    var quantityTotal = 0;
    req.models.Tipos.find({Familias_id_familia: req.body.familia}, function (err, tipos) {
      if(err)
        res.send(err);

      tipos.forEach(function (equip) {
        req.models.EquipamentosMonitorados.count({Tipos_id_tipo: equip.id_tipo, Estados_id_estado: 4}, function(err, quantidade) {
          if(err)
            res.send(err);
          quantityTotal = Number(quantityTotal) + Number(quantidade);
        });
      });

      req.models.Requisicoes.find({dataDeUso: date, turno: turno}, function (err, reqs) {
        if(err)
          res.send(err);
        
        reqs.forEach(function (equips) {
          quantidadeReq.push(equips.id_requisicao);
        });
        console.log("vetorID: " + quantidadeReq );

        if(quantidadeReq.length === 0) {
          req.models.EquipamentosRequisicao.find({Requisicoes_id_requisicao: quantidadeReq[0], Familias_id_familia: req.body.familia}, function (err, tipos) {
            if(err)
              res.send(err);
            tipos.forEach(function (equip) {
              quantityTotal = Number(quantityTotal) - Number(equip.quantidade);
              console.log("quantidadeReservada: " + equip.quantidade);
            });
            console.log("quantityTotal: " + quantityTotal);
            quantityTotal > 0 ? res.send({ code: "SUCCESS" , quantidade: quantityTotal, name: req.body.name }) : res.send({ code: "ERROR" , quantidade: 0, name: req.body.name });
          });
        }
        else {
          var i=0;
          quantidadeReq.forEach(function (equips) {
            console.log("vetorquantidadeReq: " + equips);
            req.models.EquipamentosRequisicao.find({Requisicoes_id_requisicao: equips, Familias_id_familia: req.body.familia}, function (err, tipos) {
              if(err)
                res.send(err);
              tipos.forEach(function (equips) {
                quantityTotal = Number(quantityTotal) - Number(equips.quantidade);
                console.log("quantidadeReservada: " + equips.quantidade);
              });
              i++;
              console.log("quantityTotal: " + quantityTotal);
              console.log("i: " + i + " quantidadeReq.length" + quantidadeReq.length);
              if(i>=quantidadeReq.length) {
                quantityTotal > 0 ? res.send({ code: "SUCCESS" , quantidade: quantityTotal, name: req.body.name }) : res.send({ code: "ERROR" , quantidade: 0, name: req.body.name });
              }
              else {}
              //res.send({ code: "SUCCESS" , quantidade: quantityTotal, name: req.body.name });
            });
          });
        }
      });
    });
  }
  else {
    var familyTotal = 0;
    var familyReserve = 0;
    var typeReserve = 0;
    var quantityTotalTipo = 0;
    var quantityTotal = 0;
    req.models.Tipos.find({Familias_id_familia: req.body.familia}, function (err, tipos) {
      if(err)
        res.send(err);

      tipos.forEach(function (equip) {
        req.models.EquipamentosMonitorados.count({Tipos_id_tipo: equip.id_tipo, Estados_id_estado: 4}, function(err, quantidade) {
          if(err)
            res.send(err);
          familyTotal = Number(familyTotal) + Number(quantidade);
          console.log("familyTotal: " + familyTotal);
        });
      });

      req.models.EquipamentosMonitorados.count({Tipos_id_tipo: req.body.tipo, Estados_id_estado: 4}, function(err, quantidade) {
        if(err)
          res.send(err);
        quantityTotalTipo = Number(quantityTotal) + Number(quantidade);
        console.log("quantityTotalTipo: " + quantityTotalTipo);

        req.models.Requisicoes.find({dataDeUso: date, turno: turno}, function (err, reqs) {
          if(err)
            res.send(err);
        
          reqs.forEach(function (equips) {
            quantidadeReq.push(equips.id_requisicao);
          });
          console.log("vetorID: " + quantidadeReq );

          if(quantidadeReq.length === 0) {
            req.models.EquipamentosRequisicao.find({Requisicoes_id_requisicao: quantidadeReq[0], Familias_id_familia: req.body.familia}, function (err, tipos) {
              if(err)
                res.send(err);
              tipos.forEach(function (equip) {
                familyReserve = Number(familyReserve) + Number(equip.quantidade);
                console.log("quantidadeReservada: " + equip.quantidade + " familyReserve: " + familyReserve);
              }); 

              req.models.EquipamentosRequisicao.find({Requisicoes_id_requisicao: quantidadeReq[0], Familias_id_familia: req.body.familia, Tipos_id_tipo: req.body.tipo}, function (err, tipos) {
                if(err)
                  res.send(err);
                tipos.forEach(function (equip) {
                  typeReserve = Number(typeReserve) + Number(equip.quantidade);
                  console.log("typeReserve: " + typeReserve);
                });
                quantityTotal = familyTotal - familyReserve - typeReserve;
                (familyTotal - familyReserve >= quantityTotalTipo - typeReserve) ? quantityTotal = quantityTotalTipo - typeReserve : quantityTotal = familyTotal - familyReserve
                //res.send({ code: "SUCCESS" , quantidade: quantityTotal, name: req.body.name });
                console.log("quantityTotal: " + quantityTotal);
                quantityTotal > 0 ? res.send({ code: "SUCCESS" , quantidade: quantityTotal, name: req.body.name }) : res.send({ code: "ERROR" , quantidade: 0, name: req.body.name });
              });             
            });
          }

          else {
            var i=0;
            quantidadeReq.forEach(function (equips) {
              console.log("vetorquantidadeReq: " + equips);
              req.models.EquipamentosRequisicao.find({Requisicoes_id_requisicao: equips, Familias_id_familia: req.body.familia}, function (err, tipos) {
                if(err)
                  res.send(err);
                tipos.forEach(function (equips) {
                  familyReserve = Number(familyReserve) + Number(equips.quantidade);
                  console.log("quantidadeReservada: " + equips.quantidade + " familyReserve: " + familyReserve);
                });

                req.models.EquipamentosRequisicao.find({Requisicoes_id_requisicao: equips, Familias_id_familia: req.body.familia, Tipos_id_tipo: req.body.tipo}, function (err, tipos) {
                  if(err)
                    res.send(err);
                  tipos.forEach(function (equips) {
                    typeReserve = Number(typeReserve) + Number(equips.quantidade);
                    console.log("typeReserve: " + typeReserve);
                  });
                  quantityTotal = familyTotal - familyReserve - typeReserve;
                  (familyTotal - familyReserve >= quantityTotalTipo - typeReserve) ? quantityTotal = quantityTotalTipo - typeReserve : quantityTotal = familyTotal - familyReserve
                  i++;
                  console.log("quantityTotal: " + quantityTotal);
                  console.log("i: " + i + " quantidadeReq.length" + quantidadeReq.length);
                  if(i>=quantidadeReq.length) {
                    quantityTotal > 0 ? res.send({ code: "SUCCESS" , quantidade: quantityTotal, name: req.body.name }) : res.send({ code: "ERROR" , quantidade: 0, name: req.body.name });
                  }
                  else {}
                });
              });
            });
          }
        });
      });
    });
  }
}
