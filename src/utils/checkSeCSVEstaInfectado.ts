export default function checkSeCSVEstaInfectado(value: string): boolean {
    return /<script|onerror=|onload=|javascript:/i.test(value)
  }
  