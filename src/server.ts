import bodyParser from 'body-parser';
import express, { Request, Response } from 'express';
import { deleteLocalFiles, filterImageFromURL } from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port: string = process.env.PORT || '8082';

  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]
  // EXAMPLE
  //   http://localhost:8082/filteredimage?image_url=https%3A%2F%2Fimages.unsplash.com%2Fphoto-1605559424843-9e4c228bf1c2
  app.get( '/filteredimage', async ( req: Request, res: Response ) => {
    const imageUrl: string = req.query.image_url;

    if (!imageUrl) {
      return res
        .status(422)
        .send({ message: 'image_url query parameter is required' });
    }

    try {
      const filteredpath = await filterImageFromURL(imageUrl);

      res.sendFile(filteredpath);

      deleteLocalFiles();
    } catch (error) {
      const errorMessage = error.toString();
      let errorCode = 500;

      if (error.toString().includes('Unsupported MIME type')) {
        errorCode = 422;
      }

      return res
        .status(errorCode)
        .send({ message: errorMessage });
    }
  } );

  // Root Endpoint
  // Displays a simple message to the user
  app.get( '/', async ( _, res: Response ) => {
    res.send('try GET /filteredimage?image_url={{}}')
  } );

  // Start the Server
  app.listen( port, () => {
      // tslint:disable-next-line: no-console
      console.log( `server running http://localhost:${ port }` );
      // tslint:disable-next-line: no-console
      console.log( `press CTRL+C to stop server` );
  } );
})();
