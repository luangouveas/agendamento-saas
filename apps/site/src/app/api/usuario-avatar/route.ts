import { NextRequest, NextResponse } from 'next/server'

import { supabase } from '@/lib/supabase'

export const config = {
  api: {
    bodyParser: false,
  },
}

export async function POST(request: NextRequest) {
  try {
    const dataForm = await request.formData()
    const file: File = dataForm.get('file') as File
    const idClinte: string = dataForm.get('idClinte') as string

    const { error: errorUpload } = await supabase.storage
      .from('avatars')
      .upload(`usuarios/${idClinte}`, file, {
        cacheControl: '3600',
        contentType: file.type,
        upsert: true,
      })

    const { data: dataUrl, error: errorUrl } = await supabase.storage
      .from('avatars')
      .createSignedUrl(`usuarios/${idClinte}`, 120)

    if (errorUpload || errorUrl) {
      return NextResponse.json(
        {
          error:
            'Ocorreu um erro ao tentar alterar a imagem. Tente novamente mais tarde.',
        },
        { status: 500 },
      )
    }

    return NextResponse.json(dataUrl.signedUrl, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      {
        error:
          'Ocorreu um erro ao tentar alterar a imagem. Tente novamente mais tarde.',
      },
      { status: 500 },
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const idClinte = searchParams.get('idClinte')

    const { data: dataUrl, error: errorUrl } = await supabase.storage
      .from('avatars')
      .createSignedUrl(`usuarios/${idClinte}`, 120)

    if (errorUrl) {
      return NextResponse.json(
        { error: 'Não foi possivel carregar a imagem de perfil do usuário.' },
        { status: 500 },
      )
    }

    return NextResponse.json(dataUrl.signedUrl, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Não foi possivel carregar a imagem de perfil do usuário.',
      },
      { status: 500 },
    )
  }
}
