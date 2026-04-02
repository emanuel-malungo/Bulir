import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { email, password, recaptchaToken } = await request.json();

    // Validar campos
    if (!email || !password || !recaptchaToken) {
      return NextResponse.json(
        { error: 'Email, senha e reCAPTCHA são obrigatórios' },
        { status: 400 }
      );
    }

    // TODO: Verificar reCAPTCHA token com Google
    // POST https://www.google.com/recaptcha/api/siteverify
    // com seu RECAPTCHA_SECRET_KEY

    // TODO: Validar email e password com seu backend (Prisma/BD)

    // Resposta temporária para teste
    return NextResponse.json(
      {
        success: true,
        message: 'Login realizado com sucesso!',
        // TODO: Retornar token JWT ou sessão aqui
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
