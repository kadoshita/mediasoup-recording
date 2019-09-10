const pickPort = require("pick-port");

module.exports = async (fastify, options, done) => {
  const {
    $config,
    $service: { mediasoup, record }
  } = fastify;

  fastify.post("/record/initialize", async () => {
    const { id, rtpCapabilities } = mediasoup.getRouter();
    return { rtpCapabilities, id };
  });

  fastify.post("/record/transport/create", async request => {
    const { routerId } = request.body;
    const router = mediasoup.getRouter(routerId);
    if (!router) throw new Error(`router for client: "${routerId}" not found`);

    const transport = await record.createTransport(
      router,
      $config.mediasoup.serverIp,
      $config.mediasoup.announcedIp
    );
    console.log(`transport created with id ${transport.id}`);
    console.log(`router with id ${router.id} is used`);

    return {
      id: transport.id,
      iceParameters: transport.iceParameters,
      iceCandidates: transport.iceCandidates,
      dtlsParameters: transport.dtlsParameters
    };
  });

  fastify.post("/record/transport/connect", async request => {
    const { transportId, dtlsParameters } = request.body;

    await record.connectTransport(transportId, { dtlsParameters });
    console.log(`transport with id ${transportId} connected`);

    return {};
  });

  fastify.post("/record/produce", async request => {
    const { transportId, kind, rtpParameters } = request.body;

    const producer = await record.createProducer(transportId, {
      kind,
      rtpParameters
    });
    console.log(`producer created with id ${producer.id}`);

    return { id: producer.id };
  });

  fastify.post("/record/start", async request => {
    const { producerId, routerId } = request.body;

    const router = mediasoup.getRouter(routerId);
    if (!router) throw new Error(`router with id "${routerId}" not found`);

    const recordPort = await pickPort({
      minPort: $config.record.recMinPort,
      maxPort: $config.record.recMaxPort
    });
    await record.createProducerItems(router, producerId, {
      serverIp: $config.mediasoup.serverIp,
      recordDir: $config.record.recordDir,
      gstSinkOptions: $config.record.gstreamer,
      recordPort
    });
    console.log(
      `producer with id ${producerId} is recording on port: ${recordPort}...`
    );

    return {};
  });

  done();
};
