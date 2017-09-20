module.exports = exports = function(req, res) {
  var equips = req.body.equips;
  var date = req.body.date;
  var turno = req.body.turno;
  var tamanhoVetor = 0;
  var quantidadeOK = false;
  var quantidadeReq = [];
  equips.forEach(function (equip) {
    console.log(equip.familia+"/"+equip.tipo+"/"+equip.quantidade);//1

    if (equip.tipo === null) {
      var quantityTotal = 0;
      req.models.Tipos.find({Familias_id_familia: equip.familia}, function (err, tipos) {
        if(err)
          res.send(err);

        tipos.forEach(function (equips) {
          req.models.EquipamentosMonitorados.count({Tipos_id_tipo: equips.id_tipo}, function(err, quantidade) {
            if(err)
              res.send(err);
            quantityTotal = Number(quantityTotal) + Number(quantidade);
            console.log("quantityTotal: " + quantityTotal );
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
            req.models.EquipamentosRequisicao.find({Requisicoes_id_requisicao: quantidadeReq[0], Familias_id_familia: equip.familia}, function (err, tipos) {
              if(err)
                res.send(err);
              tipos.forEach(function (equip) {
                quantityTotal = Number(quantityTotal) - Number(equip.quantidade);
                console.log("quantidadeReservada: " + equip.quantidade);
              });
              console.log("quantityTotal: " + quantityTotal);
              
              tamanhoVetor = tamanhoVetor + 1;
              console.log("tamanhoVetor: "+tamanhoVetor + " req.body.equips.length: " + req.body.equips.length);
              if(quantityTotal < equip.quantidade) {
                quantidadeOK = false;
                //res.send({ code: "nok" });
                //return;
              }
              else { quantidadeOK = true; console.log("passou aqui"); }

              if (tamanhoVetor < req.body.equips.length) {
                console.log("tem mais vetor");
              }
              else {
                quantidadeOK === true ? res.send({ code: "ok" }) : res.send({ code: "nok" })
              }
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

                  tamanhoVetor = tamanhoVetor + 1;
                  console.log("tamanhoVetor: "+tamanhoVetor + " req.body.equips.length: " + req.body.equips.length);

                  if(quantityTotal < equip.quantidade) {
                    quantidadeOK = false;
                    //res.send({ code: "nok" });
                    //return;
                  }
                  else { quantidadeOK = true; console.log("passou aqui"); }

                  if (tamanhoVetor < req.body.equips.length) {
                    console.log("tem mais vetor");
                  }
                  else {
                    quantidadeOK === true ? res.send({ code: "ok" }) : res.send({ code: "nok" })
                  }
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
      req.models.Tipos.find({Familias_id_familia: equip.familia}, function (err, tipos) {
        if(err)
          res.send(err);

        tipos.forEach(function (equips) {
          req.models.EquipamentosMonitorados.count({Tipos_id_tipo: equips.id_tipo}, function(err, quantidade) {
            if(err)
              res.send(err);
            familyTotal = Number(familyTotal) + Number(quantidade);
            console.log("familyTotal: " + familyTotal);
          });
        });

        req.models.EquipamentosMonitorados.count({Tipos_id_tipo: equip.tipo, Estados_id_estado: 4}, function(err, quantidade) {
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
              req.models.EquipamentosRequisicao.find({Requisicoes_id_requisicao: quantidadeReq[0], Familias_id_familia: equip.familia}, function (err, tipos) {
                if(err)
                  res.send(err);
                tipos.forEach(function (equip) {
                  familyReserve = Number(familyReserve) + Number(equip.quantidade);
                  console.log("quantidadeReservada: " + equip.quantidade + " familyReserve: " + familyReserve);
                }); 

                req.models.EquipamentosRequisicao.find({Requisicoes_id_requisicao: quantidadeReq[0], Familias_id_familia: equip.familia, Tipos_id_tipo: equip.tipo}, function (err, tipos) {
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
                  
                  tamanhoVetor = tamanhoVetor + 1;
                  console.log("tamanhoVetor: "+tamanhoVetor + " req.body.equips.length: " + req.body.equips.length);

                  if(quantityTotal < equip.quantidade) {
                    quantidadeOK = false;
                    //res.send({ code: "nok" });
                    //return;
                  }
                  else { quantidadeOK = true; console.log("passou aqui"); }

                  if (tamanhoVetor < req.body.equips.length) {
                    console.log("tem mais vetor");
                  }
                  else {
                    quantidadeOK === true ? res.send({ code: "ok" }) : res.send({ code: "nok" })
                  }

                });             
              });
            }

            else {
              var i=0;
              quantidadeReq.forEach(function (equips) {
                console.log("vetorquantidadeReq: " + equips);
                req.models.EquipamentosRequisicao.find({Requisicoes_id_requisicao: equips, Familias_id_familia: equip.familia}, function (err, tipos) {
                  if(err)
                    res.send(err);
                  tipos.forEach(function (equips) {
                    familyReserve = Number(familyReserve) + Number(equips.quantidade);
                    console.log("quantidadeReservada: " + equips.quantidade + " familyReserve: " + familyReserve);
                  });

                  req.models.EquipamentosRequisicao.find({Requisicoes_id_requisicao: equips, Familias_id_familia: equip.familia, Tipos_id_tipo: equip.tipo}, function (err, tipos) {
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
                      
                      tamanhoVetor = tamanhoVetor + 1;
                      console.log("tamanhoVetor: "+tamanhoVetor + " req.body.equips.length: " + req.body.equips.length);

                      if(quantityTotal < equip.quantidade) {
                        quantidadeOK = false;
                        //res.send({ code: "nok" });
                        //return;
                      }
                      else { quantidadeOK = true; console.log("passou aqui"); }

                      if (tamanhoVetor < req.body.equips.length) {
                        console.log("tem mais vetor");
                      }
                      else {
                        quantidadeOK === true ? res.send({ code: "ok" }) : res.send({ code: "nok" })
                      }

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
  });
  //console.log("quantidade: " + quantityTotal + " - disponivel: " + quant);//5
  //quantidadeOK === true ? res.send({ code: "ok" }) : res.send({ code: "nok" })
}
