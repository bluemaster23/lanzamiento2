<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Cookie;
use Symfony\Component\HttpFoundation\RedirectResponse;
use App\Resource\Security\Encrypt;

class homeController extends AbstractController {


    /**
     * @Route("/", name="index" , methods={"GET"})
     * @param Request $request
     * @return Response
     */
    public function index() {
        return $this->redirectToRoute('lanzamientos');

    }


    /**
     * @Route("/lanzamientos", name="lanzamientos" , methods={"GET"}, requirements={"react"=".+"})
     * @param Request $request
     * @return Response
     */
    public function lanzamientos(string  $a =  '') {
        return $this->render('general.html.twig', [
            'title'  => 'Lanzamientos'
        ]);

    }

    /**
     * @Route("/artista/{react}", name="artista" , methods={"GET"}, requirements={"react"=".+"})
     * @param Request $request
     * @return Response
     */
    public function artista(string  $a =  '') {
        return $this->render('general.html.twig', [
            'title'  => 'artista'
        ]);

    }

}