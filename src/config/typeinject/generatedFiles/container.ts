import PrismaInstanceDAO from '@/lib/DataAccessObjects/PrismaInstanceDAO.class'
import BoletoRepository from '@/lib/repositories/BoletoRepository.class'
import LoteRepository from '@/lib/repositories/LoteRepository.class'
import ServiceBoleto from '@/lib/services/ServiceBoleto.class'


const container = {
 singletons: new Map<string, any>(),
     PrismaInstance: () => { 
    if (!container.singletons.has('PrismaInstance')) {
      container.singletons.set('PrismaInstance', new PrismaInstanceDAO())
    }

    return container.singletons.get('PrismaInstance') },
  BoletoRepo: () => new BoletoRepository(),
  LoteRepo: () => new LoteRepository(),
  ServiceBoleto: () => new ServiceBoleto(),
};

export default container;

export type KeysForTypeInject = keyof typeof container;