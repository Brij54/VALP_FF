/*
 * Copyright 2010-2020 M16, Inc. All rights reserved.
 * This software and documentation contain valuable trade
 * secrets and proprietary property belonging to M16, Inc.
 * None of this software and documentation may be copied,
 * duplicated or disclosed without the express
 * written permission of M16, Inc.
 */

package com.rasp.app.resource;

import platform.webservice.BasePossibleValue;
import platform.webservice.Enum;

/*
 ********** This is a generated class Don't modify it.Extend this file for additional functionality **********
 * 
 */
public class Status extends BasePossibleValue {
		public static String ID_Ongoing = "Ongoing";
		public static String NAME_Ongoing = "Ongoing";
		public static String ID_Completed = "Completed";
		public static String NAME_Completed = "Completed";
		public Status() {super("STATUS");}
		protected void populate() {
 			add(new Enum(ID_Ongoing,NAME_Ongoing));
 			add(new Enum(ID_Completed,NAME_Completed));
		}
}