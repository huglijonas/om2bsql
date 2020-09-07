# OM2B SQL
- - -
*A unuseful tool to export and import .sql file with MySQL. If it is unuseful, it is essential.*
1. [Installation](#1-installation)
	1. [Add MySQL binaries to PATH variable](#11-add-mysql-binaries-to-path-variable)
		1. [Linux (/bin/sh)](#111-linux-binsh)
		2. [Mac OS X (/bin/zsh)](#112-mac-os-x-binzsh)
		3. [Windows](#113-windows)
	2. [Install OM2B SQL](#12-install-om2b-sql)
2. [Usage](#2-usage)
	1. [Export](#21-export)
	2. [Import](#22-import)
    3. [List](#23-list)

## 1. Installation
*OMB2B SQL* can only be used with MySQL and if MySQL is locally installed (127.0.0.1/localhost).
Be sure that the *mysql* and *mysqldump* command is in your environment variables!
- - -

### 1.1 Add MySQL binaries to PATH variable:
If you didn't add the MySQL binary folder to your PATH, it is not a problem:
#### 1.1.1 Linux (/bin/sh):
```
shell> cd $HOME
shell> nano .basrhc
```
Add the following line to the end of the file:
```
export PATH=/folder/to/mysql/bin/:$PATH
```

```
shell> source .bashrc
```
- - -
#### 1.1.2 Mac OS X (/bin/zsh):

```
shell> cd $HOME
shell> nano .zshrc
```
Add the following line to the end of the file:
```
export PATH=/folder/to/mysql/bin/:$PATH
```

```
shell> source .zshrc
```
- - -
#### 1.1.3 Windows:
1. On the Windows desktop, right-click ***My Computer***.
2. In the pop-up menu, click ***Properties***.
3. In the ***System Properties*** window, click the ***Advanced*** tab, and then click ***Environment Variables***.
4. In the ***System Variables*** window, highlight ***Path***, and click ***Edit***.
5. In the ***Edit System Variables*** window, insert the cursor at the end of the ***Variable*** value field.
6. If the last character is not a semi-color (;) add one.
7. After the final semi-colon, type the full path to the MySQL binary folder you need to add.
```
Example: C:\MySQL\bin
```
8. Click ***Ok*** in each open window.
9. Execute ***cmd.exe*** or ***powershell.exe***.

- - -

### 1.2 Install OM2B SQL
Execute the following command:

```
shell> npm install -g om2bsql
```

## 2. Usage

### 2.1 Export
Exporting with GUI:

```
shell> om2bsql export
```

### 2.2 Import
Import with GUI:

```
shell> om2bsql import
```

### 2.3 List
List all databases or tables in one database:

```
shell> om2bsql list
```
