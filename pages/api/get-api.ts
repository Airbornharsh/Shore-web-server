const main = async (req: any, res: any) => {
  try {
    res.send({ api_uri: "https://shore.vercel.app" });
  } catch (e: any) {
    res.status(500).send({ message: e.message });
  }
};

export default main;
