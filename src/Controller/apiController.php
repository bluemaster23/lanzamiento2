<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Cookie;
use Symfony\Component\HttpFoundation\RedirectResponse;
use App\Service\spotifyService;

/**
 * @Route("/api", name="api-") 
 */

class apiController extends AbstractController {


    /**
     * @Route("/getToken", name="getToken" , methods={"POST"})
     * @param Request $request
     */

    public function getToken( spotifyService $spotify){
        try{
            $token = $spotify->getToken();
            return new JsonResponse([
                'success' => true,
                'token' => $token
            ]);
        }catch(\Exception $e){
            return new JsonResponse([
                'success' => false,
                'token' => '',
                'msg' => 'error'
            ], 400);
        }
    }

    
    /**
     * @Route("/getAlbum", name="getAlbum" , methods={"GET"})
     * @param Request $request
     */

    public function getAlbum( Request $request, spotifyService $spotify){
        try{
            $page   = $request->query->get('page');
            $page  = ( is_numeric($page)) ?  $page : 0;
            $spotify->setToken($request->query->get('token'));
            $data = $spotify->getNewAlbum($page*20);
            return new JsonResponse([
                'success' => true,
                'data' => $data["albums"]["items"],
                'page' => $page +1 
            ]);
        }catch(\Exception $e){
            return new JsonResponse([
                'success' => false,
                'token' => '',
                'msg' => 'error'
            ], 400);
        }
    }

    /**
     * @Route("/getArtista", name="getArtista" , methods={"GET"})
     * @param Request $request
     */

    public function getArtista( Request $request, spotifyService $spotify){
        try{
            $id   = $request->query->get('id');
            $spotify->setToken($request->query->get('token'));
            $artista = $spotify->getArstist($id);
            $track = $spotify->getTopTrackArtist($id);
            return new JsonResponse([
                'success' => true,
                'data' => [
                    'artista' => count($artista) > 0  ?  $artista : [],
                    'top' => count($track) > 0  ?  $track["tracks"] : []
                ]
            ]);
        }catch(\Exception $e){
            return new JsonResponse([
                'success' => false,
                'token' => '',
                'msg' => 'error'
            ], 400);
        }
    }
}