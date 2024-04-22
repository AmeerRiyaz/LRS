"use strict";

const { Contract } = require("fabric-contract-api");
const shim = require("fabric-shim");
const ClientIdentity = require("fabric-shim").ClientIdentity;

class LRSContract extends Contract {



    async initLedger(ctx) {
        console.info("============= START : Initialize Ledger ===========");
        console.info("============= END : Initialize Ledger ===========");
    }

    async propertyOwner(ctx, args) {
        args = JSON.parse(args);
        let data = {
            Name: args[0],
            CheckslipNo: args[1],
            RegDocNo: args[2],
            Aadhaar: args[3]
        }
        await ctx.stub.putState(Aadhaar, Buffer.from(JSON.stringify(data)));
        return JSON.stringify(data)

    }

    async queryProperty(ctx, args) {
        args = JSON.parse(args)
        let appId = args[0]
        const ID = await ctx.stub.getState(appId);
        console.log("id", ID.toString())
        if (!ID || ID.length === 0) {
            throw new Error(`${appId} does not exist`);
        }
        console.log(ID.toString());
        //return the entire data present in the ledger 
        return ID.toString();


    }



    async checkslips(ctx, args) {
        console.info("============`=========== Recording New Data");
        console.log("The arguments are: ", args);
        // console.info(value)
        let cid = new ClientIdentity(ctx.stub);

        //check the of the user
        if (cid.assertAttributeValue("role", "registrationDept") == false) {
            console.log("checking the user role");
            return "not an authorized user";
        } else {

            args = JSON.parse(args);

            let data = {
                SROCode: args[0],
                CheckslipNo: args[1],
                CheckslipYear: args[2],
                Executant: [{
                    Name: args[3],
                    RCode: args[4],
                    RName: args[5],
                    Aadhaar: args[6],
                    Pan: args[7]
                },
                {
                    Name: args[8],
                    RCode: args[9],
                    RName: args[10],
                    Aadhaar: args[11],
                    Pan: args[12]
                }
                ],
                Claiment: [{
                    Name: args[13],
                    RCode: args[14],
                    RName: args[15],
                    Aadhaar: args[16],
                    Pan: args[17]
                },
                {
                    Name: args[18],
                    RCode: args[19],
                    RName: args[20],
                    Aadhaar: args[21],
                    Pan: args[22]
                }
                ],
                MajorTable: {
                    PresentationDate: args[23],
                    ExecutionDate: args[24],
                    TransactionType: args[25]
                },
                SchedulePropertyData: [{
                    ScheduleNo: args[26],
                    Juridiction: args[27],
                    WardNo: args[28],
                    BlockNo: args[29],
                    Village: args[30],
                    District: args[31],
                    Mandal: args[32],
                    SurveyNo: args[33],
                    PlotNo: args[34],
                    OldHouseNo: args[35],
                    Extent: args[36],
                    ExtentUnit: args[37],
                    DocNature: args[38]
                },
                {
                    ScheduleNo: args[39],
                    Juridiction: args[40],
                    WardNo: args[41],
                    BlockNo: args[42],
                    Village: args[43],
                    District: args[44],
                    Mandal: args[45],
                    SurveyNo: args[46],
                    PlotNo: args[47],
                    OldHouseNo: args[48],
                    Extent: args[49],
                    ExtentUnit: args[50],
                    DocNature: args[51]
                }
                ],
                uniquePropertyId:args[52]
            };



            console.log("The arguments are: ", args[0], args[1]);

            console.log("data", data, CheckslipNo)





            await ctx.stub.putState(args[52], Buffer.from(JSON.stringify(data)));
            // await ctx.stub.putState(args[16], Buffer.from(JSON.stringify(propertyOwner)));
            return JSON.stringify({ data: "Successfully Recored checkslips the details", sFlag: true }); //send the data to the sdk
        }
    }



    //query using uuid
    async regularDoc(ctx, args) {
        //inserted on regdocno
        let cid = new ClientIdentity(ctx.stub);

        //check the of the user
        if (cid.assertAttributeValue("role", "registrationDept") == false) {
            console.log("checking the user role");
            return "not an authorized user";
        } else {

            args = JSON.parse(args);
            let data = {
                
                RegistrationDate: args[0],

                RegDocNo: args[1],
                RegDocYear: args[2],
                WitnessData: [
                    {
                        Code: args[3],
                        Name: args[4],
                        PAN: args[5],
                        Aadhaar: args[6]
                    },
                    {
                        Code: args[7],
                        Name: args[8],
                        Pan: args[9],
                        Aadhaar: args[10]
                    }
                ],
                uniquePropertyId: args[11]

            }

            console.log("data", data)

            // console.log("data", encumbrancedata)
            await ctx.stub.putState(args[11], Buffer.from(JSON.stringify(data)));
            return JSON.stringify({ data: "Successfully Recored Regular Document Details", sFlag: true });

        }

    }










    async encumbarncedata(ctx, args) {
        //pass uid
        args = JSON.parse(args)
        let data = args[0]
        let cid = new ClientIdentity(ctx.stub);

        //check the of the user
        if (cid.assertAttributeValue("role", "revenueDept") == false) {
            console.log("checking the user role");
            return "not an authorized user";
        } else {
            let history = [];
            const iteratorPromise = ctx.stub.getHistoryForKey(data);
            for await (const res of iteratorPromise) {
                history.push({
                    txId: res.txId,
                    value: res.value.toString(),
                    isDelete: res.isDelete,
                });
            }
            console.info("=====history ", history);

            return JSON.stringify({
                key: data,
                values: history,
            });
        }
    }










}
module.exports = LRSContract;