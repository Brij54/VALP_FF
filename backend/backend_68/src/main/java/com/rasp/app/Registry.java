package com.rasp.app;
import com.rasp.app.decorator.BatchDecorator;
import com.rasp.app.decorator.CertificateDecorator;
import com.rasp.app.decorator.ProgramRegistrationDecorator;
import com.rasp.app.decorator.StudentDecorator;
import platform.decorator.DecoratorManager;
import platform.helper.HelperManager;
import platform.webservice.ServiceManager;
import com.rasp.app.helper.*;
import com.rasp.app.service.*;
public class Registry {
		public static void register(){
				HelperManager.getInstance().register(BatchHelper.getInstance());
				HelperManager.getInstance().register(CertificateHelper.getInstance());
				HelperManager.getInstance().register(DeanHelper.getInstance());
				HelperManager.getInstance().register(ProgramHelper.getInstance());
				HelperManager.getInstance().register(ProgramRegistrationHelper.getInstance());
				HelperManager.getInstance().register(ResourceRoleHelper.getInstance());
				HelperManager.getInstance().register(RoleResourcePermissionHelper.getInstance());
				HelperManager.getInstance().register(RoleUserResInstanceHelper.getInstance());
				HelperManager.getInstance().register(StudentHelper.getInstance());
				HelperManager.getInstance().register(TestHelper.getInstance());
				HelperManager.getInstance().register(UsersHelper.getInstance());
				ServiceManager.getInstance().register(new BatchService());
				ServiceManager.getInstance().register(new CertificateService());
				ServiceManager.getInstance().register(new DeanService());
				ServiceManager.getInstance().register(new ProgramService());
				ServiceManager.getInstance().register(new ProgramRegistrationService());
				ServiceManager.getInstance().register(new ResourceRoleService());
				ServiceManager.getInstance().register(new RoleResourcePermissionService());
				ServiceManager.getInstance().register(new RoleUserResInstanceService());
				ServiceManager.getInstance().register(new StudentService());
				ServiceManager.getInstance().register(new TestService());
				ServiceManager.getInstance().register(new UsersService());
                DecoratorManager.getInstance().register(new StudentDecorator());
                DecoratorManager.getInstance().register(new CertificateDecorator());
                DecoratorManager.getInstance().register(new ProgramRegistrationDecorator());
                DecoratorManager.getInstance().register(new BatchDecorator());
		}
}
